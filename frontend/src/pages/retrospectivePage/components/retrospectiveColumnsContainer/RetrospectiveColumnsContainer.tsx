import { Box, MenuItem, useMediaQuery } from "@mui/material";
import { ThumbUp, ThumbDown, Lightbulb } from "@mui/icons-material";
import EditorSelect from "../../../../components/workItemEditor/EditorSelect";
import RetrospectiveColumn from "../retrospectiveColumn/RetrospectiveColumn";
import { ColumnsContainer } from "../../RetrospectivePage.styles";
import { RetrospectiveColumnsContainerProps } from "../../../../types";
import { RetroTypes } from "../../../../constants";

const categories = [
  {
    type: RetroTypes.POSITIVE,
    title: "Positive",
    color: "success",
    icon: <ThumbUp />,
  },
  {
    type: RetroTypes.NEGATIVE,
    title: "Negative",
    color: "error",
    icon: <ThumbDown />,
  },
  {
    type: RetroTypes.IMPROVEMENT,
    title: "Improvements",
    color: "warning",
    icon: <Lightbulb />,
  },
] as const;

export default function RetrospectiveColumnsContainer({
  selectedCategory,
  setSelectedCategory,
  ...props
}: RetrospectiveColumnsContainerProps) {
  const wide = useMediaQuery(props.theme.breakpoints.up("lg"));
  return (
    <Box sx={{ minWidth: 0 }}>
      {!wide && (
        <Box sx={{ mb: 2, maxWidth: 380 }}>
          <EditorSelect
            label="Feedback category"
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value as RetroTypes)}
          >
            {categories.map((category) => (
              <MenuItem key={category.type} value={category.type}>
                {category.title} (
                {
                  props.retroCards.filter((card) => card.type === category.type)
                    .length
                }
                )
              </MenuItem>
            ))}
          </EditorSelect>
        </Box>
      )}
      <ColumnsContainer>
        {categories
          .filter((category) => wide || category.type === selectedCategory)
          .map((category) => (
            <RetrospectiveColumn key={category.type} {...props} {...category} />
          ))}
      </ColumnsContainer>
    </Box>
  );
}
