"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Button,
  Stack,
  Box,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MusicNote from "@mui/icons-material/MusicNote";
import { useTheme } from "@mui/material/styles";

const LOCALE = "de-DE";
const TIME_ZONE = "Europe/Berlin";

const dayFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  day: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});

type EventCardProps = {
  id: string;
  title: string;
  startDate: Date;
  location: string;
  image: string;
  imageAlt: string;
  tag: string;
};

export default function EventCard({
  id,
  title,
  startDate,
  location,
  image,
  imageAlt,
  tag,
}: EventCardProps) {
  const theme = useTheme();

  const eventDate = new Date(startDate);
  const day = dayFormatter.format(eventDate);
  const month = monthFormatter.format(eventDate).toUpperCase();
  const time = timeFormatter.format(eventDate);
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: theme.palette.custom.white,
        boxShadow: 3,
      }}
    >
      {/* Image */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="300"
          image={image}
          alt={imageAlt}
          sx={{
            objectFit: "cover",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        />

        {/* Badge & Date */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Chip
            label={tag}
            sx={{
              height: "auto",
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.primary.main,
              fontWeight: "bold",
              px: 1.5,
              py: 1,
              borderRadius: 1.5,
            }}
            icon={<MusicNote color="primary" />}
            size="small"
          />
          <Box
            sx={{
              backgroundColor: theme.palette.custom.white,
              borderRadius: 2,
              boxShadow: `0 1px 4px rgba(0,0,0,0.2)`,
              textAlign: "center",
              p: 1,
            }}
          >
            <Typography fontWeight="bold" variant="superLarge">
              {day}
            </Typography>
            <Typography
              variant="caption"
              fontWeight="bold"
              sx={{
                fontSize: 32,
                textTransform: "uppercase",
                color: theme.palette.primary.main,
              }}
            >
              {month}
            </Typography>
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ pt: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <AccessTimeIcon
              sx={{ fontSize: 16, color: theme.palette.secondary.main }}
            />
            <Typography
              variant="body2"
              sx={{ color: theme.palette.secondary.main }}
            >
              {time}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <LocationOnIcon
              sx={{ fontSize: 16, color: theme.palette.secondary.main }}
            />
            <Typography
              variant="body2"
              sx={{ color: theme.palette.secondary.main }}
            >
              {location}
            </Typography>
          </Stack>
        </Stack>

        <Typography
          variant="h3"
          component="h3"
          fontWeight="bold"
          gutterBottom
          sx={{ marginBottom: 3 }}
        >
          {title}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          href={`/event/${id}`}
        >
          Buchen
        </Button>
      </CardContent>
    </Card>
  );
}
