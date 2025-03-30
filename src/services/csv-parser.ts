import fs from "fs";
import csvParser from "csv-parser";

export interface InstructorCSV {
  Offering: string;
  Campus: string;
  Delivery: string;
  Name: string;
  Email: string;
  Courses: string;
}

export const parseCSV = async (filePath: string): Promise<InstructorCSV[]> => {
  const instructors: InstructorCSV[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(
        csvParser({
          headers: [
            "Offering",
            "Campus",
            "Delivery",
            "Name",
            "Email",
            "Courses",
          ],
          skipLines: 1,
        })
      )
      .on("data", (row) => {
        // if (!row.Name || !row.Email || !row.Courses) {
        //   console.warn("Skipping row due to missing required fields:", row);
        //   return;
        // }

        instructors.push({
          Offering: row.Offering,
          Campus: row.Campus,
          Delivery: row.Delivery,
          Name: row.Name,
          Email: row.Email,
          Courses: row.Courses,
        });
      })
      .on("end", () => resolve(instructors))
      .on("error", (error) => reject(error));
  });
};
