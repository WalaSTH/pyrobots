import { Form } from "formik";
import { Card, Grid, Typography } from "@mui/material";
import TextField from "../TextField";
import SubmitFormButton from "../SubmitFormButton";

export default function CreateMatchForm() {
  return <div></div>;
}
//   return (
//     <Box
//       sx={{
//         marginTop: 10,
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//       }}
//     >
//       <Formik
//         initialValues={{
//           ...initialFormState,
//         }}
//         validationSchema={formValidation}
//         onSubmit={handleSubmit}
//       >
//         <Form>
//           <Card
//             variant="outlined"
//             sx={{ marginTop: 3, padding: 3, borderRadius: 3 }}
//           >
//             <Grid container spacing={2}>
//               <Grid item xs={12} sx={{ textAlign: "center" }}>
//                 <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
//                   Create Match
//                 </Typography>
//               </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 name="name"
//                 label="Name of the match"
//                 autoComplete="off"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 name="password"
//                 label="Password (Optional)"
//                 type="password"
//                 autoComplete="off"
//               />
//             </Grid>

//             <Grid item xs={6} textAlign="center">
//               <TextField
//                 name="min_players"
//                 label="Min players"
//                 placeholder="2"
//                 autoComplete="off"
//               />
//             </Grid>

//             <Grid item xs={6} textAlign="center">
//               <TextField
//                 name="max_players"
//                 label="Max players"
//                 placeholder="4"
//                 autoComplete="off"
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 name="games_per_match"
//                 label="Games"
//                 placeholder="200"
//                 autoComplete="off"
//               />
//             </Grid>

//             <Grid item xs={6}>
//               <TextField
//                 name="rounds"
//                 label="Rounds"
//                 placeholder="10000"
//                 autoComplete="off"
//               />
//             </Grid>

//             <Grid item xs={12} textAlign="center">
//               <Typography>Choose your robot!</Typography>
//               <TextField name="robot_id" label="Robot ID" autoComplete="off" />
//             </Grid>

//             <Grid item xs={12}>
//               <SubmitFormButton>Create match</SubmitFormButton>
//             </Grid>
//           </Grid>
//         </Card>
//       </Form>
//     </>
//   );
// }
