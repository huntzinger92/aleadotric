export const inputsContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "20px",
};

export const inputsRow = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

export const sliderAndLabel = {
  flexGrow: 1,
  padding: "5px",
  minWidth: "110px",
};

export const selectContainer = {
  display: "grid",
  gridTemplateRows: "auto auto",
  gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
  gap: "10px",
  marginBottom: "10px",
};

export const select = {
  color: "white",
};

export const selectFirst = {
  ...select,
  gridColumn: { xs: "1 / 3", sm: "1 / 3", md: "1" },
};
