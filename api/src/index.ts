import express, { Request, Response } from "express";
import { Kafka } from "kafkajs";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

const ensureTopicExists = async (kafka: Kafka, topicName: string) => {
  const admin = kafka.admin();
  try {
    console.log(">>> Trying to connect to Kafka Admin client");
    await admin.connect();

    console.log(">>> Connected to Kafka admin client");

    const topicCreated = await admin.createTopics({
      topics: [{ topic: topicName, numPartitions: 1 }],
      waitForLeaders: true, // Wait for the topic to have a leader before proceeding
    });

    if (topicCreated) {
      console.log(`>>> Topic '${topicName}' created`);
    } else {
      console.log(`>>> Topic '${topicName}' already exists`);
    }
  } catch (error) {
    console.error("Error ensuring topic exists:", error);
  } finally {
    await admin.disconnect();
    console.log("Kafka admin client disconnected");
  }
};

// Kafka setup
const kafka = new Kafka({
  clientId: "call-events-api",
  brokers: ["broker:29092"], // Points to the Kafka container
});

const topicName = "call-events";
ensureTopicExists(kafka, topicName);

const producer = kafka.producer();

const runKafkaProducer = async () => {
  console.log(">>> Trying to connect to Kafka producer, at port 29092");
  await producer.connect();

  console.log(">>> Kafka producer connected");
};

runKafkaProducer().catch(console.error);

producer.on("producer.disconnect", async () => {
  console.warn("Producer disconnected. Attempting to reconnect...");
  await producer.connect();
});

// Endpoint to receive PBX events and send them to Kafka
app.post("/callEvents", async (req: Request, res: Response) => {
  console.log(">>> request payload: ", req.body);
  // const {
  //   eventType,
  //   vrId,
  //   originCallId,
  //   callId,
  //   remotePartyNumber,
  //   additionalInfo,
  // } = req.body;

  // const event = {
  //   id: uuidv4(),
  //   timestamp: new Date().toISOString(),
  //   eventType: eventType,
  //   vrId: vrId,
  //   originCallId: originCallId,
  //   callId: callId,
  //   remotePartyNumber,
  //   localPartyNumber: "12345",
  //   ucxSuiteTag: "sample-tag",
  //   additionalInfo,
  // };

  try {
    await producer.send({
      topic: "call-events",
      messages: [{ value: JSON.stringify(req.body) }],
    });
    console.log("Event sent to Kafka:", JSON.stringify(req.body));
    res.status(200).send({ status: "event sent" });
  } catch (error) {
    console.error("Error sending event to Kafka", error);
    res.status(500).send({ status: "error", error });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://api:${port}`);
});
