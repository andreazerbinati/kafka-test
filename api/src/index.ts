import express, { Request, Response } from 'express';
import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Kafka setup
const kafka = new Kafka({
  clientId: 'call-events-api',
  brokers: ['kafka:9092'], // Points to the Kafka container
});

const producer = kafka.producer();

const runKafkaProducer = async () => {
  await producer.connect();
  console.log('Kafka producer connected');
};

runKafkaProducer().catch(console.error);

// Endpoint to receive PBX events and send them to Kafka
app.post('/callEvents', async (req: Request, res: Response) => {
  const { eventType, vrId, originCallId, callId, remotePartyNumber } = req.body;

  const event = {
    Id: uuidv4(),
    Timestamp: new Date().toISOString(),
    EventType: eventType,
    VrId: vrId,
    OriginCallId: originCallId,
    CallId: callId,
    RemotePartyNumber: remotePartyNumber,
    LocalPartyNumber: "12345",
    UcxSuiteTag: "sample-tag",
    AdditionalInfo: {}
  };

  try {
    await producer.send({
      topic: 'call-events',
      messages: [{ value: JSON.stringify(event) }],
    });
    console.log('Event sent to Kafka:', event);
    res.status(200).send({ status: 'event sent', event });
  } catch (error) {
    console.error('Error sending event to Kafka', error);
    res.status(500).send({ status: 'error', error });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

