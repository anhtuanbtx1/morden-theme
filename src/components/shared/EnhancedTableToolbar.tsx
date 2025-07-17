import React from 'react';
import {
  Toolbar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { IconSearch, IconPlus, IconRefresh, IconFilter, IconTrash } from '@tabler/icons';

interface FilterOption {
  value: string;
  label: string;
}

interface EnhancedTableToolbarProps {
  title: string;
  numSelected?: number;
  search: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  
  // Add button
  onAddClick?: () => void;
  addButtonText?: string;
  addButtonIcon?: React.ReactNode;
  
  // Filters
  filters?: {
    label: string;
    value: string | string[];
    options: FilterOption[];
    onChange: (value: any) => void;
    multiple?: boolean;
    minWidth?: number;
  }[];
  
  // Action buttons
  onResetData?: () => void;
  customActions?: React.ReactNode;
  
  // Selection actions
  selectionActions?: React.ReactNode;
}

const EnhancedTableToolbar: React.FC<EnhancedTableToolbarProps> = ({
  title,
  numSelected = 0,
  search,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  onAddClick,
  addButtonText = "Thêm mới",
  addButtonIcon = <IconPlus size="1rem" />,
  filters = [],
  onResetData,
  customActions,
  selectionActions
}) => {

  const renderFilterValue = (selected: string | string[], options: FilterOption[], multiple?: boolean) => {
    if (multiple && Array.isArray(selected)) {
      if (selected.length === 0) {
        return '';
      } else if (selected.length === 1) {
        const option = options.find(opt => opt.value === selected[0]);

        return option?.label || selected[0];
      } else if (selected.length === 2) {
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => {
              const option = options.find(opt => opt.value === value);

              return (
                <Chip 
                  key={value} 
                  label={option?.label || value} 
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.75rem',
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    color: 'primary.main'
                  }}
                />
              );
            })}
          </Box>
        );
      } else {
        const firstOption = options.find(opt => opt.value === selected[0]);

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip 
              label={firstOption?.label || selected[0]} 
              size="small"
              sx={{
                height: 20,
                fontSize: '0.75rem',
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                color: 'primary.main'
              }}
            />
            <Chip 
              label={`+${selected.length - 1} khác`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.75rem',
                backgroundColor: 'rgba(158, 158, 158, 0.08)',
                color: 'text.secondary'
              }}
            />
          </Box>
        );
      }
    }

    const option = options.find(opt => opt.value === selected);

    return option?.label || selected;
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <>
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
            {numSelected} đã chọn
          </Typography>
          {selectionActions || (
            <Tooltip title="Xóa">
              <IconButton>
                <IconTrash width="18" />
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <>
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Search Field */}
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={search}
              onChange={onSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="1rem" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />

            {/* Dynamic Filters */}
            {filters.map((filter, index) => (
              <FormControl key={index} size="small" sx={{ minWidth: filter.minWidth || 120 }}>
                <InputLabel>{filter.label}</InputLabel>
                <Select
                  multiple={filter.multiple}
                  value={filter.value}
                  label={filter.label}
                  onChange={(e) => filter.onChange(e.target.value)}
                  renderValue={filter.multiple ? 
                    (selected) => renderFilterValue(selected as string[], filter.options, true) :
                    (selected) => renderFilterValue(selected as string, filter.options, false)
                  }
                  sx={{
                    borderRadius: 2,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0,0,0,0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  {filter.options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}

            {/* Add Button */}
            {onAddClick && (
              <Button
                variant="contained"
                color="primary"
                startIcon={addButtonIcon}
                onClick={onAddClick}
                size="small"
                sx={{
                  ml: 1,
                  minWidth: 120,
                  height: 32,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  borderRadius: 1,
                  px: 2
                }}
              >
                {addButtonText}
              </Button>
            )}

            {/* Custom Actions */}
            {customActions}

            {/* Reset Button */}
            {onResetData && (
              <Tooltip title="Reset về dữ liệu ban đầu">
                <IconButton
                  onClick={onResetData}
                  color="warning"
                  size="small"
                  sx={{
                    width: 32,
                    height: 32,
                    ml: 0.5
                  }}
                >
                  <IconRefresh size="1rem" />
                </IconButton>
              </Tooltip>
            )}

            {/* Filter Icon (optional) */}
            <Tooltip title="Lọc danh sách">
              <IconButton>
                <IconFilter size="1.2rem" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
