import app from "./app.js";
import dbConnect from "./db.js";
const PORT = 8080 || process.env.PORT;

// app.listen(PORT, () => {
//   console.log("server Connected !! , PORT: ", PORT);
// });

dbConnect()
  .then(() => {
    try {
      app.listen(PORT, () => {
        console.log("server Connected !! , PORT: ", PORT);
      });
    } catch (error) {
      console.log("Server Connecting Error !!!");
      throw error;
    }
  })
  .catch((error) => {
    console.log("MONGO Connection Error !!");
    throw error;
  });
