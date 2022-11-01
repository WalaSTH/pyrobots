import { useState } from "react";
import { Button, ButtonGroup, Popover, Box, Card } from "@mui/material";

export default function FilterButton({ ...otherProps }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <Box>
      <Button onClick={handleClick} {...otherProps}>
        Filter by
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Card>
          <ButtonGroup
            variant="text"
            orientation="vertical"
            aria-label="outlined primary button group"
          >
            <Button>Available</Button>
            <Button>Joined</Button>
            <Button>Hosted</Button>
          </ButtonGroup>
        </Card>
      </Popover>
    </Box>
  );
}
