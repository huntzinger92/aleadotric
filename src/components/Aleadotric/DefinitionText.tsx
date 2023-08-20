import { Box, Fade, Typography } from "@mui/material";
import "./Aleadotric.css";

export const DefinitionText = ({
  primaryColor,
  secondaryColor,
}: {
  primaryColor: string;
  secondaryColor: string;
}) => {
  return (
    <Box
      sx={{
        color: primaryColor,
      }}
      id="definitionContainerShown"
    >
      <Typography variant="subtitle2">
        <Fade in timeout={3000}>
          <span>
            <span id="definitionWord" style={{ color: secondaryColor }}>
              Aleatoric
            </span>
          </span>
        </Fade>
        <Fade in style={{ transitionDelay: "2000ms" }} timeout={3000}>
          <span>
            {" "}
            - involving elements of chance during music composition or
            performance
          </span>
        </Fade>
      </Typography>
    </Box>
  );
};
