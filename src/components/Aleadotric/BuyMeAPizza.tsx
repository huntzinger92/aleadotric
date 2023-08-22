import { Box, Link, Typography } from "@mui/material";

export const BuyMeAPizza = () => {
  return (
    <Box sx={{ marginTop: "10px " }}>
      <Typography>Enjoy content like this and want more of it?</Typography>
      <Link
        href="https://www.buymeacoffee.com/trevdev"
        underline="hover"
        target="_blank"
      >
        Buy the dev a coffee!
      </Link>
    </Box>
  );
};
