import { Publisher, OrderCreatedEvent, Subjects } from "@amytickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
 