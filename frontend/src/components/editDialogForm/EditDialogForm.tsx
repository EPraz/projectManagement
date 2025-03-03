import {
  IconButton,
  Typography,
  Box,
  TextField,
  Menu,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { Close, MoreVert, ExpandMore, ExpandLess } from "@mui/icons-material";
import React, { useState } from "react";
import {
  Controller,
  type Path,
  PathValue,
  useForm,
  useWatch,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/x-date-pickers";
import { formatStatusName } from "../../helpers";
import {
  DetailSection,
  DetailTitle,
  DialogHeader,
  FieldContainer,
  FieldContent,
  FieldLabel,
  FieldWrapper,
  GridContainer,
  HeaderActions,
  HeaderTitle,
  LeftPanel,
  MainContent,
  RightPanel,
  SectionContent,
  SectionHeader,
  SectionTitle,
  StyledDialog,
  StyledTextarea,
  TaskTitleText,
  TopFieldsSection,
  TopSection,
  typeColors,
  UpdatedByText,
  UserAvatar,
  UserInfo,
  UserSection,
} from "./EditDialogForm.styles";
import { EditDialogFormProps } from "../../types";
import SaveActions from "./SaveActions";

const EditDialogForm = <T extends Record<string, any>>({
  open,
  onClose,
  onSubmit,
  onDelete,
  schema,
  defaultValues,
  idNumber,
  disabled = false,
  sections = [],
  selectFields = [],
  rightPanelFields = [],
  topCenterFields = [],
  user = { name: "User Name", initials: "UN" },
  categoryType = "Product Backlog Item",
}: EditDialogFormProps<T>) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<T>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    disabled,
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>(
    sections.reduce((acc, section) => ({ ...acc, [section.title]: true }), {})
  );

  const watchedValues = useWatch({ control });
  const hasChanges =
    JSON.stringify(watchedValues) !== JSON.stringify(defaultValues);

  const handleEllipsisClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const renderField = (fieldName: Path<T>, isRightPanel = false) => {
    const selectField = selectFields.find((f) => f.name === fieldName);

    // const label =
    //   selectField?.label ||
    //   fieldName.charAt(0).toUpperCase() +
    //     fieldName.slice(1).replace(/([A-Z])/g, " $1");

    const dateFields = ["createdat", "updatedat", "dueDate"];

    if (dateFields.includes(fieldName.toLowerCase())) {
      return (
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <DatePicker
              label=""
              value={field.value ? new Date(field.value) : null}
              onChange={(newValue) => field.onChange(newValue)}
              disabled={disabled || isRightPanel}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors[fieldName],
                  helperText: (errors[fieldName]?.message as string) || "",
                  size: "small",
                  margin: "dense",
                  disabled: disabled || isRightPanel,
                  InputLabelProps: { style: { display: "none" } },
                  InputProps: {
                    endAdornment: disabled || isRightPanel ? null : undefined,
                  },
                  sx: {
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border:
                        disabled || isRightPanel ? "none" : "1px solid #0078d4",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #0078d4",
                    },
                  },
                },
              }}
            />
          )}
        />
      );
    }

    if (selectField) {
      return (
        <FormControl fullWidth size="small" margin="dense">
          <Controller
            name={fieldName}
            control={control}
            defaultValue={
              (defaultValues[fieldName] ?? "") as unknown as PathValue<
                T,
                Path<T>
              >
            }
            render={({ field }) => (
              <FormControl fullWidth size="small" margin="dense">
                <Select
                  {...field}
                  error={!!errors[fieldName]}
                  disabled={disabled || isRightPanel}
                  displayEmpty
                  value={
                    typeof field.value === "object"
                      ? field.value?.id
                      : field.value
                  }
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      border:
                        disabled || isRightPanel ? "none" : "1px solid #0078d4",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #0078d4",
                    },
                  }}
                >
                  {selectField.options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {formatStatusName(option.name)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </FormControl>
      );
    }

    if (
      fieldName.toLowerCase().includes("description") ||
      fieldName.toLowerCase().includes("notes") ||
      fieldName.toLowerCase().includes("criteria") ||
      fieldName.toLowerCase().includes("details") ||
      fieldName.toLowerCase().includes("design")
    ) {
      return (
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <StyledTextarea
              {...field}
              minRows={5}
              disabled={isRightPanel}
              placeholder=""
            />
          )}
        />
      );
    }

    return (
      <Controller
        name={fieldName}
        control={control}
        defaultValue={
          (defaultValues[fieldName] ?? "") as unknown as PathValue<T, Path<T>>
        }
        render={({ field }) => (
          <TextField
            {...field}
            size="small"
            margin="none"
            error={!!errors[fieldName]}
            helperText={(errors[fieldName]?.message as string) || ""}
            disabled={disabled || isRightPanel}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: disabled || isRightPanel ? "none" : "1px solid #0078d4",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #0078d4",
              },
            }}
          />
        )}
      />
    );
  };

  return (
    <StyledDialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
      <DialogHeader categoryType={categoryType as keyof typeof typeColors}>
        <HeaderTitle>
          <span>{categoryType}</span>
          <span>#{idNumber}</span>
        </HeaderTitle>
        <HeaderActions>
          <IconButton size="small" onClick={handleClose}>
            <Close />
          </IconButton>
        </HeaderActions>
      </DialogHeader>

      <TopSection>
        <UserSection>
          <UserInfo>
            <UserAvatar>{user.initials}</UserAvatar>
            <Typography variant="body2">{user.name}</Typography>
          </UserInfo>

          <Box sx={{ display: "flex", gap: 1 }}>
            <SaveActions
              onSave={handleSubmit(onSubmit)}
              onSaveAndClose={() => {
                handleSubmit(onSubmit);
                handleClose();
              }}
              disabled={!hasChanges || disabled}
            />

            <IconButton size="small" onClick={handleEllipsisClick}>
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        </UserSection>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TaskTitleText>#{idNumber} - </TaskTitleText>
          <FieldContainer>{renderField("title" as Path<T>)}</FieldContainer>
        </Box>

        {defaultValues.updatedBy && (
          <UpdatedByText>
            Last updated by {defaultValues.updatedBy}
          </UpdatedByText>
        )}
      </TopSection>

      <TopFieldsSection>
        <GridContainer>
          {topCenterFields.map((fieldName) => (
            <FieldWrapper key={fieldName as string}>
              <FieldLabel>
                {fieldName.charAt(0).toUpperCase() +
                  fieldName.slice(1).replace(/([A-Z])/g, " $1")}
              </FieldLabel>
              <FieldContent>{renderField(fieldName)}</FieldContent>
            </FieldWrapper>
          ))}
        </GridContainer>
      </TopFieldsSection>

      <MainContent>
        <LeftPanel>
          {sections.map((section, index) => (
            <React.Fragment key={index}>
              <SectionHeader onClick={() => toggleSection(section.title)}>
                <SectionTitle>{section.title}</SectionTitle>
                {expandedSections[section.title] ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </SectionHeader>
              {expandedSections[section.title] && (
                <SectionContent>
                  {section.fields.map((fieldName) => (
                    <FieldContainer key={fieldName}>
                      {renderField(fieldName as Path<T>)}
                    </FieldContainer>
                  ))}
                </SectionContent>
              )}
            </React.Fragment>
          ))}
        </LeftPanel>

        <RightPanel>
          <DetailSection>
            <DetailTitle>Details</DetailTitle>
            {rightPanelFields.map((fieldName) => (
              <FieldWrapper key={fieldName as string}>
                <FieldLabel>
                  {fieldName.charAt(0).toUpperCase() +
                    fieldName.slice(1).replace(/([A-Z])/g, " $1")}
                </FieldLabel>
                <FieldContent>{renderField(fieldName, true)}</FieldContent>
              </FieldWrapper>
            ))}
          </DetailSection>
        </RightPanel>
      </MainContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (onDelete) {
              onDelete(defaultValues as T);
            }
            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
          }}
        >
          Change Type
        </MenuItem>
      </Menu>
    </StyledDialog>
  );
};

export default EditDialogForm;
