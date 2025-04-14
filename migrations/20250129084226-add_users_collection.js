export async function up(db) {
  await db.createCollection("users", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "email"],
        properties: {
          name: { bsonType: "string" },
          email: { bsonType: "string", pattern: "^.+@.+$" },
          password: { bsonType: "string" },
        }
      }
    }
  });
}

export async function down(db) {
  await db.collection("users").drop();
}
