import { SmartToy as SmartToyIcon } from "@mui/icons-material";
import {
  Avatar,
  FormControl,
  InputLabel,
  ListItemAvatar,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useField, useFormikContext } from "formik";

const testRobots = [
  { name: "Robot 1", avatar: "" },
  { name: "Robot 2", avatar: "" },
  { name: "Robot 3", avatar: "" },
  { name: "Robot 4", avatar: "" },
  { name: "Robot 5", avatar: "" },
  { name: "Robot 6", avatar: "" },
  { name: "Robot 7", avatar: "" },
  { name: "Robot 8", avatar: "" },
  { name: "Robot 9", avatar: "" },
  { name: "Robot 10", avatar: "" },
];

export default function SelectRobot({ name, ...otherProps }) {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  function handleChange(event) {
    const {
      target: { value },
    } = event;
    setFieldValue(name, value);
  }

  const configSelect = {
    label: "Robot",
    displayEmpty: true,
    fullWidth: true,
    value: field.value,
    renderValue: (selected) => selected,
    onChange: handleChange,
    ...otherProps,
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Robot</InputLabel>
      <Select {...configSelect}>
        {testRobots.map((robot) => (
          <MenuItem key={robot.name} value={robot.name}>
            <ListItemAvatar>
              <Avatar alt={robot.name} src={robot.avatar}>
                <SmartToyIcon />
              </Avatar>
            </ListItemAvatar>
            <Typography noWrap>{robot.name}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
