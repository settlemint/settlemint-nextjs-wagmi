
const middlewareUrl = new URL(`/${process.env.BTP_TOKEN}`, process.env.PORTAL_URL);

// $`openapi-typescript ${middlewareUrl.toString()}/docs/json -o src/app/portal/portal-schema-rest.d.ts`
//   .then(() => {
//     console.log("Portal schema generated");
//   })
//   .catch((err) => {
//     console.error(err);
//     process.exit(1);
//   });
