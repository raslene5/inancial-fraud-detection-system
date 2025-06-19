import { Box, Button, Typography, useTheme, Paper } from "@mui/material";
import { tokens } from "../theme";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={3}
      bgcolor={colors.primary[400]}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "15px",
          maxWidth: "600px",
          width: "100%",
          bgcolor: colors.primary[500],
          border: `1px solid ${colors.grey[800]}`,
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <ErrorOutlineIcon
            sx={{ fontSize: "80px", color: colors.redAccent[500], mb: 2 }}
          />
          <Typography variant="h4" color={colors.grey[100]} gutterBottom>
            Something went wrong
          </Typography>
          <Typography
            variant="body1"
            color={colors.grey[300]}
            sx={{ mb: 3, wordBreak: "break-word" }}
          >
            {error?.message || "An unexpected error occurred"}
          </Typography>

          <Box
            sx={{
              p: 2,
              borderRadius: "8px",
              bgcolor: colors.primary[600],
              width: "100%",
              mb: 3,
              maxHeight: "200px",
              overflow: "auto",
            }}
          >
            <Typography
              variant="body2"
              color={colors.grey[400]}
              sx={{
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                textAlign: "left",
              }}
            >
              {error?.stack || "No stack trace available"}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            sx={{
              bgcolor: colors.greenAccent[600],
              color: colors.grey[900],
              fontWeight: "bold",
              "&:hover": {
                bgcolor: colors.greenAccent[500],
              },
              px: 4,
              py: 1,
            }}
          >
            Refresh Page
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ErrorFallback;