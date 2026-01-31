if (!process.env.DB_URI) {
  throw new Error("MONGO URI NOT FOUND");
}
