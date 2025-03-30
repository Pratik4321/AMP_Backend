// src/jobs/weekly-instructor-reminder.ts
import Instructor from "../models/instructor.model";
import { sendBatchAMPEmails } from "../utils/batch-email";
import { logger } from "../utils/logger";

/**
 * Weekly job that sends reminder emails to instructors with pending status
 */
export const sendWeeklyInstructorReminders = async (): Promise<void> => {
  try {
    // Find all instructors with pending status
    const pendingInstructors = await Instructor.find({ status: "pending" });

    console.log(pendingInstructors);

    logger.info(
      `Found ${pendingInstructors.length} instructors with pending status`
    );

    // Exit early if no pending instructors
    if (pendingInstructors.length === 0) {
      logger.info("No pending instructors to notify");
      return;
    }

    // Send email to each pending instructor
    // let successCount = 0;
    // let failureCount = 0;
    await sendBatchAMPEmails(pendingInstructors, "Reminder Email");

    // for (const instructor of pendingInstructors) {
    //   try {
    //     // Skip if no email address
    //     if (!instructor.Email) {
    //       logger.warn(
    //         `Instructor ${instructor._id} (${instructor.Name || "unnamed"}) has no email address`
    //       );
    //       failureCount++;
    //       continue;
    //     }

    //     // Prepare email content
    //     const emailSubject =
    //       "Action Required: Complete Your Instructor Profile";
    //     const emailBody = `
    //       <p>Dear ${instructor.Name || "Instructor"},</p>

    //       <p>Our records show that your instructor profile is still pending completion.
    //       Please log in to your account and complete your profile setup to ensure you're
    //       properly listed for upcoming course assignments.</p>

    //       <p>Your profile includes:</p>
    //       <ul>
    //         <li>Offering: ${instructor.Offering || "Not specified"}</li>
    //         <li>Campus: ${instructor.Campus || "Not specified"}</li>
    //         <li>Delivery: ${instructor.Delivery || "Not specified"}</li>
    //         <li>Courses: ${instructor.Courses || "Not specified"}</li>
    //       </ul>

    //       <p>If you have any questions or need assistance, please contact our support team.</p>

    //       <p>Thank you,<br>
    //       The Academic Administration Team</p>
    //     `;

    //     // Send the email
    //     // await sendBatchAMPEmails(pendingInstructors);
    //     logger.info(`Sent reminder email to instructor: ${instructor.Email}`);
    //     successCount++;
    //   } catch (error) {
    //     logger.error(
    //       `Failed to send email to instructor ${instructor._id} (${instructor.Email}):`,
    //       error
    //     );
    //     failureCount++;
    //   }
    // }

    // Log summary
    // logger.info(
    //   `Weekly instructor reminder job completed. Success: ${successCount}, Failures: ${failureCount}`
    // );
  } catch (error) {
    logger.error("Error in weekly instructor reminder job:", error);
    throw error;
  }
};
