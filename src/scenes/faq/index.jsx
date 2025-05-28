import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SecurityIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";
import VerifiedIcon from "@mui/icons-material/Verified";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Header title="System Overview & Usage Guide" subtitle="Fraud Detection System Insights and Instructions" />
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
          <Typography color={colors.greenAccent[500]} variant="h5">
            How does your fraud detection system work?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Our fraud detection system uses advanced algorithms to analyze transaction data in real-time, looking for patterns indicative of fraud. We monitor user behavior, transaction history, and other risk factors to provide immediate alerts when suspicious activities are detected.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
          <Typography color={colors.greenAccent[500]} variant="h5">
            What should I do if I suspect fraudulent activity?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            If you suspect fraud, please contact us immediately through the support section. Additionally, make sure to lock your accounts and change passwords for added security. Our team will investigate the issue and provide guidance on the next steps.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
          <Typography color={colors.greenAccent[500]} variant="h5">
            How do you prevent false positives in fraud detection?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Our system uses machine learning models that are continuously trained and refined to minimize false positives. We also offer customizable sensitivity settings for users to adjust detection levels based on their preferences.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
          <Typography color={colors.greenAccent[500]} variant="h5">
            Is my data safe with your system?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, your data is protected by end-to-end encryption and secure data storage. We follow industry best practices to ensure your personal and financial information remains private and safe from unauthorized access.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
          <Typography color={colors.greenAccent[500]} variant="h5">
            What types of fraud does your system detect?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Our system is designed to detect various types of fraud, including credit card fraud, identity theft, account takeover, transaction manipulation, and more. It can also identify unusual behavior patterns such as sudden spikes in transactions.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Add Icons for Visual Enhancement */}
      <Box display="flex" justifyContent="space-around" mt="30px">
        <SecurityIcon sx={{ color: colors.greenAccent[500], fontSize: "40px" }} />
        <WarningIcon sx={{ color: colors.redAccent[500], fontSize: "40px" }} />
        <VerifiedIcon sx={{ color: colors.blueAccent[500], fontSize: "40px" }} />
      </Box>
    </Box>
  );
};

export default FAQ;
