import { Order } from '../models/Order.js';

// Environment Configuration
const env = process.env.SHIPSY_ENV || 'SANDBOX';
const shipsyServer = process.env.SHIPSY_API_SERVER || 'https://app.shipsy.in';
const defaultApiKey = process.env.SHIPSY_API_KEY || 'dd317959c7be680c9e391545504d6e';
const defaultCbApiKey = process.env.SHIPSY_CB_API_KEY || 'b6de1ea7fcf393f4djh14567bbb12e';
const defaultCustomerCode = process.env.SHIPSY_CUSTOMER_CODE || 'SHIPSY';

console.log(`🚚 Shipsy Courier Integration running in ${env} mode.`);

/**
 * Helper to fetch API Keys based on request details
 */
const getApiConfig = (isCrossBorder = false) => {
  return {
    apiKey: isCrossBorder ? defaultCbApiKey : defaultApiKey,
    customerCode: defaultCustomerCode,
    serverUrl: shipsyServer
  };
};

/**
 * CREATE CONSIGNMENT
 * Admin triggers consignment creation for a PAID order
 */
export const createConsignment = async (req, res) => {
  try {
    const {
      orderId,
      courierPartner,
      serviceTypeId,
      loadType,
      weight,
      length,
      width,
      height,
      city,
      district,
      ewayBill
    } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (order.paymentStatus !== 'PAID') {
      return res.status(400).json({ success: false, error: 'Consignment can only be created for PAID orders' });
    }

    const isCrossBorder = order.country && order.country.toLowerCase() !== 'india';
    const config = getApiConfig(isCrossBorder);

    // Update order with temporary details
    order.shippingDetails = {
      ...order.shippingDetails,
      courierPartner: courierPartner || (isCrossBorder ? 'DTDC' : 'DTDC'),
      courierAccount: serviceTypeId || (isCrossBorder ? 'DTDC - PREMIUM D' : 'PREMIUM'),
      isCrossBorder,
      ewayBill: ewayBill || '',
      city: city || order.state,
      district: district || order.state,
      weight: parseFloat(weight) || 0.25,
      dimensions: {
        length: parseFloat(length) || 5,
        width: parseFloat(width) || 5,
        height: parseFloat(height) || 5
      }
    };

    if (env === 'SANDBOX') {
      // High-Fidelity Sandbox Simulation Mode
      const simulatedRef = isCrossBorder ? `INTL${Date.now().toString().slice(-8)}` : `E${Date.now().toString().slice(-8)}`;
      order.shippingDetails.consignmentReference = simulatedRef;
      order.shippingDetails.courierPartnerReferenceNumber = Math.floor(100000000 + Math.random() * 900000000).toString();
      order.shippingDetails.consignmentStatus = 'pickup_scheduled';
      order.shippingDetails.events = [
        {
          type: 'pickup_scheduled',
          event_time: Date.now(),
          hub_name: 'Booking Hub',
          hub_code: 'BOOKINGHUB',
          customer_update: 'Pickup Scheduled',
          notes: 'Mock: Consignment successfully registered in Sandbox.',
          is_otp_verified: true
        }
      ];

      order.deliveryStatus = 'Shipping';
      await order.save();

      console.log(`[SANDBOX] Simulated consignment created for order ${order.txnId}: ${simulatedRef}`);
      return res.json({
        success: true,
        message: 'Consignment created successfully (SANDBOX MODE)',
        reference_number: simulatedRef,
        courier_partner: order.shippingDetails.courierPartner,
        courier_account: order.shippingDetails.courierAccount
      });
    }

    // PRODUCTION MODE: Direct Shipsy API Call
    if (isCrossBorder) {
      // 1. Cross-border API call
      const cbPayload = {
        consignments: [
          {
            customer_seller_code: config.customerCode,
            origin_details: {
              address_line_1: 'B-23 Sushant Lok I',
              address_line_2: 'Opp. Bestech Centre Point Mall',
              city: 'Gurgaon',
              name: 'Apasya Shilajit',
              phone: '9971149561',
              pincode: '122009',
              state: 'Haryana',
              country: 'India',
              email: 'origin@shilajit.com'
            },
            destination_details: {
              name: order.name,
              phone: order.phone1,
              address_line_1: order.address,
              address_line_2: '',
              country: order.country,
              state: order.state,
              city: city || order.state,
              pincode: order.pincode,
              email: 'customer@email.com'
            },
            billing_details: {
              address_line_1: 'B-23 Sushant Lok I',
              address_line_2: 'Opp. Bestech Centre Point Mall',
              city: 'Gurgaon',
              name: 'Apasya Shilajit',
              phone: '9971149561',
              pincode: '122009',
              state: 'Haryana',
              country: 'India',
              email: 'billing@shilajit.com'
            },
            load_type: loadType || 'NON-DOCUMENT',
            length: parseFloat(length) || 10,
            width: parseFloat(width) || 10,
            height: parseFloat(height) || 5,
            weight: parseFloat(weight) || 1,
            service_type_id: serviceTypeId || 'DTDC - PREMIUM D',
            commodity_name: 'Apasya Shilajit',
            declared_value: order.price,
            currency: 'INR',
            num_pieces: order.quantity || 1,
            eway_bill_number: ewayBill || '',
            invoice_number: order.txnId,
            invoice_date: new Date(order.createdAt).toISOString().split('T')[0],
            customer_reference_number: order.txnId,
            notes: 'Premium Shilajit Resin Shipment'
          }
        ]
      };

      console.log(`Calling Shipsy Cross-Border API at ${config.serverUrl}/api/customer/integration/consignment/cb/intl/softdata`);
      const response = await fetch(`${config.serverUrl}/api/customer/integration/consignment/cb/intl/softdata`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': config.apiKey
        },
        body: JSON.stringify(cbPayload)
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (err) {
        throw new Error(`Failed to parse Shipsy CB response: ${responseText}`);
      }

      console.log('Shipsy CB API Response:', JSON.stringify(responseData));

      if (responseData.status === 'OK' || responseData.success) {
        // Cross border matches reference_number from customer_reference_number
        const refNumber = order.txnId;
        order.shippingDetails.consignmentReference = refNumber;
        order.shippingDetails.consignmentStatus = 'pickup_scheduled';
        order.deliveryStatus = 'Shipping';
        await order.save();

        return res.json({
          success: true,
          reference_number: refNumber,
          courier_partner: order.shippingDetails.courierPartner,
          courier_account: order.shippingDetails.courierAccount
        });
      } else {
        return res.status(400).json({
          success: false,
          error: responseData.message || 'Failed to register cross-border consignment with Shipsy'
        });
      }
    } else {
      // 2. Domestic API call
      const domesticPayload = {
        action_type: 'single_pickup',
        consignment_type: 'forward',
        movement_type: 'forward',
        eway_bill: ewayBill || '',
        load_type: loadType || 'NON-DOCUMENT',
        description: 'Apasya Shilajit',
        customer_code: config.customerCode,
        reference_number: order.txnId,
        service_type_id: serviceTypeId || 'PREMIUM',
        dimension_unit: 'in',
        length: String(length || 5),
        width: String(width || 5),
        height: String(height || 5),
        weight_unit: 'kg',
        weight: String(weight || 0.25),
        cod_amount: '0',
        invoice_amount: String(order.price),
        invoice_number: order.txnId,
        invoice_date: new Date(order.createdAt).toISOString().split('T')[0],
        declared_value: order.price,
        declared_value_without_tax: order.price,
        num_pieces: order.quantity || 1,
        customer_reference_number: order.txnId,
        courier_partner: courierPartner || 'DTDC',
        origin_details: {
          address_hub_code: 'GGN002',
          name: 'Apasya Shilajit',
          phone: '9971149561',
          alternate_phone: '8586999698',
          address_line_1: 'B-23 Sushant Lok I',
          address_line_2: 'Opp. Bestech Centre Point Mall',
          pincode: '122009',
          district: 'Gurgaon',
          city: 'Gurgaon',
          state: 'Haryana',
          country: 'India',
          latitude: '34.288',
          longitude: '34.288'
        },
        destination_details: {
          address_hub_code: '',
          name: order.name,
          phone: order.phone1,
          alternate_phone: order.phone2 || '',
          address_line_1: order.address,
          address_line_2: '',
          pincode: order.pincode,
          district: district || order.state,
          city: city || order.state,
          state: order.state,
          country: order.country,
          latitude: '',
          longitude: ''
        }
      };

      console.log(`Calling Shipsy Domestic API at ${config.serverUrl}/api/customer/integration/consignment/upload/softdata/v2`);
      const response = await fetch(`${config.serverUrl}/api/customer/integration/consignment/upload/softdata/v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': config.apiKey
        },
        body: JSON.stringify(domesticPayload)
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (err) {
        throw new Error(`Failed to parse Shipsy response: ${responseText}`);
      }

      console.log('Shipsy Domestic API Response:', JSON.stringify(responseData));

      if (responseData.success || responseData.status === 'OK') {
        const refNumber = responseData.reference_number || order.txnId;
        order.shippingDetails.consignmentReference = refNumber;
        order.shippingDetails.courierPartnerReferenceNumber = responseData.courier_partner_reference_number || '';
        order.shippingDetails.consignmentStatus = 'pickup_scheduled';
        order.deliveryStatus = 'Shipping';
        await order.save();

        return res.json({
          success: true,
          reference_number: refNumber,
          courier_partner: responseData.courier_partner || order.shippingDetails.courierPartner,
          courier_account: responseData.courier_account || order.shippingDetails.courierAccount
        });
      } else {
        return res.status(400).json({
          success: false,
          error: responseData.message || 'Failed to create consignment'
        });
      }
    }
  } catch (error) {
    console.error('Create Consignment Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

/**
 * REAL-TIME CONSIGNMENT TRACKING
 * Fetches real-time status and timeline events from Shipsy track API
 */
export const trackConsignment = async (req, res) => {
  try {
    const { referenceNumber } = req.params;

    if (!referenceNumber) {
      return res.status(400).json({ success: false, error: 'Reference number is required' });
    }

    const order = await Order.findOne({ 'shippingDetails.consignmentReference': referenceNumber });
    const isCrossBorder = order && order.shippingDetails && order.shippingDetails.isCrossBorder;
    const config = getApiConfig(isCrossBorder);

    if (env === 'SANDBOX') {
      // High-Fidelity Tracking Simulation depending on when the order was created
      const timeDiffMs = Date.now() - (order ? order.createdAt.getTime() : Date.now());
      const stages = [
        { type: 'pickup_awaited', customer_update: 'Pickup Awaited', hub_name: 'Booking Hub', delay: 0 },
        { type: 'pickup_scheduled', customer_update: 'Pickup Scheduled', hub_name: 'Booking Hub', delay: 30000 },
        { type: 'reachedathub', customer_update: 'Reached At Hub', hub_name: 'Regional Sorting Hub', delay: 90000 },
        { type: 'outfordelivery', customer_update: 'Out For Delivery', hub_name: 'Destination Hub', delay: 180000 },
        { type: 'delivered', customer_update: 'Delivered', hub_name: 'Destination Hub', delay: 300000 }
      ];

      const events = [];
      let latestStatus = 'pickup_scheduled';

      stages.forEach((stage) => {
        if (timeDiffMs >= stage.delay) {
          events.unshift({
            type: stage.type,
            event_time: (order ? order.createdAt.getTime() : Date.now()) + stage.stageDelay,
            hub_name: stage.hub_name,
            hub_code: stage.hub_name.replace(/\s+/g, '').toUpperCase(),
            customer_update: stage.customer_update,
            notes: `Mock Event: Shipment successfully transitioned to ${stage.customer_update}.`,
            is_otp_verified: stage.type === 'delivered'
          });
          latestStatus = stage.type;
        }
      });

      // Sync deliveryStatus and events in DB if Order exists
      if (order) {
        order.shippingDetails.consignmentStatus = latestStatus;
        order.shippingDetails.events = events;
        if (latestStatus === 'delivered') {
          order.deliveryStatus = 'Delivered';
        } else if (latestStatus === 'outfordelivery') {
          order.deliveryStatus = 'Out for Delivery';
        }
        await order.save();
      }

      return res.json({
        success: true,
        reference_number: referenceNumber,
        status: latestStatus,
        events: events
      });
    }

    // PRODUCTION MODE: Direct track API
    console.log(`Tracking Shipsy consignment: ${referenceNumber}`);
    const url = `${config.serverUrl}/api/customer/integration/consignment/track?reference_number=${referenceNumber}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'api-key': config.apiKey,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (err) {
      throw new Error(`Failed to parse Shipsy track response: ${responseText}`);
    }

    console.log('Shipsy Track API Response Status:', response.status);

    if (response.status === 200 && responseData.reference_number) {
      // Sync into MongoDB
      if (order) {
        order.shippingDetails.consignmentStatus = responseData.status || order.shippingDetails.consignmentStatus;
        order.shippingDetails.events = responseData.events || [];
        
        // Sync order deliveryStatus
        if (responseData.status === 'delivered') {
          order.deliveryStatus = 'Delivered';
        } else if (responseData.status === 'outfordelivery' || responseData.status === 'out_for_delivery') {
          order.deliveryStatus = 'Out for Delivery';
        }
        await order.save();
      }

      return res.json({
        success: true,
        reference_number: responseData.reference_number,
        status: responseData.status,
        events: responseData.events || []
      });
    } else {
      return res.status(400).json({
        success: false,
        error: responseData.message || 'Consignment track failed'
      });
    }
  } catch (error) {
    console.error('Track Consignment Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

/**
 * STREAM SHIPPING LABEL PDF
 * Fetches label PDF from Shipsy and streams it back to admin client
 */
export const streamLabel = async (req, res) => {
  try {
    const { referenceNumber } = req.params;

    if (!referenceNumber) {
      return res.status(400).json({ success: false, error: 'Reference number is required' });
    }

    const order = await Order.findOne({ 'shippingDetails.consignmentReference': referenceNumber });
    const isCrossBorder = order && order.shippingDetails && order.shippingDetails.isCrossBorder;
    const config = getApiConfig(isCrossBorder);

    if (env === 'SANDBOX') {
      // High-Fidelity Sandbox PDF Stream
      // Create a small, valid raw PDF representation containing standard details
      const mockPdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 200 >>
stream
BT
/F1 24 Tf
100 700 Td
(APASYA SHILAJIT SHIPPING LABEL) Tj
/F1 12 Tf
0 -50 Td
(Reference: ${referenceNumber}) Tj
0 -20 Td
(Carrier: ${order ? order.shippingDetails.courierPartner : 'DTDC'}) Tj
0 -20 Td
(Recipient: ${order ? order.name : 'Valued Customer'}) Tj
0 -20 Td
(Address: ${order ? order.address : '123 Test Street'}) Tj
0 -40 Td
(SANDBOX DEMO LABEL - FOR TESTING PURPOSES ONLY) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000223 00000 n 
0000000290 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
540
%%EOF`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="label-${referenceNumber}.pdf"`);
      return res.send(Buffer.from(mockPdf, 'utf-8'));
    }

    // PRODUCTION MODE: Fetch PDF binary from Shipsy
    console.log(`Streaming PDF label from Shipsy: ${referenceNumber}`);
    const url = `${config.serverUrl}/api/customer/integration/consignment/shippinglabel/stream?reference_number=${referenceNumber}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'api-key': config.apiKey,
        'Accept': 'application/pdf'
      }
    });

    if (response.status === 200) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="label-${referenceNumber}.pdf"`);
      return res.send(buffer);
    } else {
      const responseText = await response.text();
      console.error('Shipsy Label Stream failed response:', responseText);
      return res.status(response.status).json({
        success: false,
        error: `Failed to download label PDF from Shipsy: status ${response.status}`
      });
    }
  } catch (error) {
    console.error('Label Stream Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};

/**
 * CANCEL CONSIGNMENT
 * Sends cancellation request to Shipsy
 */
export const cancelConsignment = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const referenceNumber = order.shippingDetails && order.shippingDetails.consignmentReference;
    if (!referenceNumber) {
      return res.status(400).json({ success: false, error: 'No active consignment found for this order' });
    }

    const isCrossBorder = order.shippingDetails.isCrossBorder;
    const config = getApiConfig(isCrossBorder);

    if (env === 'SANDBOX') {
      // Sandbox cancellation simulation
      order.shippingDetails.consignmentStatus = 'cancelled';
      order.deliveryStatus = 'Processing'; // Reset to processing
      order.shippingDetails.events.unshift({
        type: 'cancelled',
        event_time: Date.now(),
        hub_name: 'Booking Hub',
        hub_code: 'BOOKINGHUB',
        customer_update: 'Consignment Cancelled',
        notes: 'Mock: Consignment successfully cancelled in Sandbox.',
        is_otp_verified: false
      });
      await order.save();

      console.log(`[SANDBOX] Simulated consignment cancelled: ${referenceNumber}`);
      return res.json({
        success: true,
        message: 'Consignment cancelled successfully (SANDBOX MODE)',
        cancelled_consignments: [referenceNumber]
      });
    }

    // PRODUCTION MODE: Shipsy Cancel Call
    const cancelPayload = {
      AWBNo: [referenceNumber],
      customerCode: config.customerCode
    };

    console.log(`Calling Shipsy Cancel API at ${config.serverUrl}/api/customer/integration/consignment/cancel`);
    const response = await fetch(`${config.serverUrl}/api/customer/integration/consignment/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': config.apiKey
      },
      body: JSON.stringify(cancelPayload)
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (err) {
      throw new Error(`Failed to parse Shipsy cancellation response: ${responseText}`);
    }

    console.log('Shipsy Cancel API Response:', JSON.stringify(responseData));

    if (responseData.success || responseData.status === 'OK') {
      order.shippingDetails.consignmentStatus = 'cancelled';
      order.deliveryStatus = 'Processing'; // Reset delivery status
      order.shippingDetails.events.unshift({
        type: 'cancelled',
        event_time: Date.now(),
        hub_name: 'Booking Hub',
        hub_code: 'BOOKINGHUB',
        customer_update: 'Consignment Cancelled',
        notes: 'Consignment successfully cancelled.',
        is_otp_verified: false
      });
      await order.save();

      return res.json({
        success: true,
        message: 'Consignment cancelled successfully',
        cancelled_consignments: responseData.successConsignments || [referenceNumber]
      });
    } else {
      return res.status(400).json({
        success: false,
        error: responseData.message || 'Shipsy cancellation failed'
      });
    }
  } catch (error) {
    console.error('Cancel Consignment Error:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
};
