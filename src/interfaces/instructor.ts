export interface IInstructor extends Document {
  _id: string;
  Offering: string;
  Campus: string;
  Delivery: string;
  Name: string;
  Email: string;
  Courses: string;
  status?: "pending" | "available" | "not-available";
  createdAt: Date;
  updatedAt: Date;
}
//
