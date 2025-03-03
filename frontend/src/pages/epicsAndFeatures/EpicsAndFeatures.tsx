import type React from "react";
import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterListIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Epic } from "../../types";
import {
  Container,
  Content,
  DragHandle,
  EpicCard,
  FeatureCard,
  Header,
  ItemContent,
  ItemHeader,
  SearchBar,
} from "./EpicsAndFeatures.styles";

const mockData: Epic[] = [
  // {
  //   id: "EPIC-1",
  //   title: "User Authentication System",
  //   // status: "In Progress",
  //   assignee: {
  //     name: "John Doe",
  //     avatar: "/placeholder.svg?height=32&width=32",
  //   },
  //   startDate: "2024-01-01",
  //   endDate: "2024-03-31",
  //   features: [
  //     {
  //       id: "FEAT-1",
  //       title: "Login System",
  //       // status: "In Progress",
  //       // assignee: {
  //       //   name: "Jane Smith",
  //       //   avatar: "/placeholder.svg?height=32&width=32",
  //       // },
  //       // priority: "High",
  //     },
  //     {
  //       id: "FEAT-2",
  //       title: "Password Recovery",
  //       // status: "To Do",
  //       as: {
  //         name: "Mike Johnson",
  //         avatar: "/placeholder.svg?height=32&width=32",
  //       },
  //       priority: "Medium",
  //     },
  //   ],
  // },
];

export default function EpicsAndFeaturesPage() {
  const theme = useTheme();
  const [epics, setEpics] = useState<Epic[]>(mockData);
  const [expandedEpics, setExpandedEpics] = useState<Set<string>>(
    new Set([mockData[0].id])
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<{
    type: "epic" | "feature";
    id: string;
  } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"epic" | "feature">("epic");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEpics = useMemo(() => {
    if (!searchQuery) return epics;
    const query = searchQuery.toLowerCase();
    return epics.filter(
      (epic) =>
        epic.title.toLowerCase().includes(query) ||
        epic.features.some((feature) =>
          feature.title.toLowerCase().includes(query)
        )
    );
  }, [epics, searchQuery]);

  const handleExpandEpic = (epicId: string) => {
    setExpandedEpics((prev) => {
      const next = new Set(prev);
      if (next.has(epicId)) {
        next.delete(epicId);
      } else {
        next.add(epicId);
      }
      return next;
    });
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: "epic" | "feature",
    id: string
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedItem({ type, id });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleOpenDialog = (type: "epic" | "feature") => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return theme.palette.primary.main;
      case "completed":
        return theme.palette.success.main;
      case "to do":
        return theme.palette.grey[500];
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Container>
      <Header elevation={0}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog("epic")}
            sx={{ height: 40 }}
          >
            New Epic
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog("feature")}
            sx={{ height: 40 }}
          >
            New Feature
          </Button>
        </Box>
        <SearchBar>
          <TextField
            size="small"
            placeholder="Search epics and features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: "100%", sm: 250 } }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{ height: 40 }}
          >
            Filter
          </Button>
        </SearchBar>
      </Header>

      <Content>
        {filteredEpics.map((epic) => (
          <EpicCard key={epic.id} elevation={0}>
            <ItemHeader
              onClick={() => handleExpandEpic(epic.id)}
              sx={{ cursor: "pointer" }}
            >
              <DragHandle />
              <IconButton size="small">
                {expandedEpics.has(epic.id) ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowRightIcon />
                )}
              </IconButton>
              <ItemContent>
                <Typography variant="subtitle1" fontWeight="medium">
                  {epic.title}
                </Typography>
                {/* <Chip
                  label={epic?.status || ''}
                  size="small"
                  sx={{
                    bgcolor: `${getStatusColor(epic.status)}14`,
                    color: getStatusColor(epic.status),
                    fontWeight: 500,
                  }}
                />
                <Tooltip title={epic.assignee.name}>
                  <Avatar
                    src={epic.assignee.avatar}
                    alt={epic.assignee.name}
                    sx={{ width: 28, height: 28 }}
                  />
                </Tooltip> */}
                {/* <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: "auto" }}
                >
                  {epic?.startDate} - {epic?.endDate}
                </Typography> */}
              </ItemContent>
              <IconButton
                size="small"
                onClick={(e) => handleMenuClick(e, "epic", epic.id)}
              >
                <MoreVertIcon />
              </IconButton>
            </ItemHeader>
            <Collapse in={expandedEpics.has(epic.id)}>
              {epic.features.map((feature) => (
                <FeatureCard key={feature.id} elevation={0}>
                  <ItemHeader>
                    <DragHandle />
                    <ItemContent>
                      <Typography variant="body2">{feature.title}</Typography>
                      {/* <Chip
                        label={feature.status}
                        size="small"
                        sx={{
                          bgcolor: `${getStatusColor(feature.status)}14`,
                          color: getStatusColor(feature.status),
                          fontWeight: 500,
                        }}
                      /> */}
                      {/* <Chip
                        label={feature.priority}
                        size="small"
                        color={getPriorityColor(feature.priority) as any}
                        sx={{ fontWeight: 500 }}
                      />
                      <Tooltip title={feature.assignee.name}>
                        <Avatar
                          src={feature.assignee.avatar}
                          alt={feature.assignee.name}
                          sx={{ width: 28, height: 28 }}
                        />
                      </Tooltip> */}
                    </ItemContent>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, "feature", feature.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ItemHeader>
                </FeatureCard>
              ))}
            </Collapse>
          </EpicCard>
        ))}
      </Content>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        elevation={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Typography>Edit</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Typography>Change Status</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Typography>Assign To</Typography>
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
          {`New ${dialogType === "epic" ? "Epic" : "Feature"}`}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField label="Title" fullWidth size="small" />
            {dialogType === "epic" && (
              <>
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </>
            )}
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ p: 3, pt: 2, borderTop: 1, borderColor: "divider" }}
        >
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
