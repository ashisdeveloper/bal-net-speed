export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Balasore Alloys LTD API with Swagger",
      version: "1.0.0",
      description: "API Documentation For Balasore Alloys LTD",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Ashis Kumar",
        url: "https://web.whatsapp.com/send?phone=919777735384?text=Hello%20Ashis",
        email: "srimanashis@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8001/api-docs",
      },
    ],
  },
  apis: ["src/routes*.js"],
};
