import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.color = "#94A3B8";
ChartJS.defaults.borderColor = "rgba(255,255,255,0.08)";
ChartJS.defaults.font.family = "'Inter', sans-serif";