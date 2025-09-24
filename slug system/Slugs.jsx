import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideNavbar from "./SideNavbar";
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  InputAdornment
} from "@mui/material";
import { addAdminSlug, deleteAdminSlug, getAdminSlug, updateAdminSlug } from "../../Store/ActionCreators/AdminSlugActionCreators";

export default function Slugs() {
  const dispatch = useDispatch();
  const allSlugs = useSelector((state) => state.AdminSlugStateData);

  const [formData, setFormData] = useState({
    slug: ""
  });
  const [selectedSlug, setSelectedSlug] = useState("");
  const [newInnerSlug, setNewInnerSlug] = useState("");
  const [showForms, setShowForms] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ _id: "", name: "", slug: "", innerSlugs: [] });
  const [newEditInnerSlug, setNewEditInnerSlug] = useState("");

  useEffect(() => {
    dispatch(getAdminSlug());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(addAdminSlug({ name: formData.slug, slug: formData.slug }));
    setFormData({ slug: "" });
  };

  const handleAddInnerSlug = async () => {
    if (!selectedSlug || !newInnerSlug.trim()) return;

    const slugToUpdate = allSlugs.find(slug => slug._id === selectedSlug);
    if (slugToUpdate) {
      const updatedInnerSlugs = [...(slugToUpdate.innerSlugs || []), newInnerSlug.trim()];
      dispatch(updateAdminSlug({ _id: slugToUpdate._id, name: slugToUpdate.name, slug: slugToUpdate.slug, innerSlugs: updatedInnerSlugs }));
      setNewInnerSlug("");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slug?")) {
      dispatch(deleteAdminSlug({ _id: id }));
    }
  };

  const handleEdit = (slug) => {
    setEditFormData({ ...slug });
    setNewEditInnerSlug("");
    setShowEditModal(true);
  };

  const handleUpdateSlug = () => {
    const updatedSlugData = { ...editFormData, name: editFormData.slug };
    dispatch(updateAdminSlug(updatedSlugData));
    setShowEditModal(false);
  };

  const handleAddEditInnerSlug = () => {
    if (!newEditInnerSlug.trim()) return;
    setEditFormData(prev => ({
      ...prev,
      innerSlugs: [...(prev.innerSlugs || []), newEditInnerSlug.trim()]
    }));
    setNewEditInnerSlug("");
  };

  const handleRemoveEditInnerSlug = (index) => {
    setEditFormData(prev => ({
      ...prev,
      innerSlugs: prev.innerSlugs.filter((_, i) => i !== index)
    }));
  };

  const selectedSlugData = allSlugs.find(slug => slug._id === selectedSlug);

  return (
    <div className="page_section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3 col-12">
            <SideNavbar />
          </div>
          <div className="col-md-9 col-12">
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                mb: 3
              }}
            >
              <Box sx={{ 
                bgcolor: '#6068bf', 
                p: 2, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <i className="fa fa-tags" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                    Slugs Management
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<i className={showForms ? "fa fa-minus" : "fa fa-plus"}></i>}
                  onClick={() => setShowForms(!showForms)}
                  sx={{ 
                    bgcolor: 'white', 
                    color: '#6068bf',
                    '&:hover': {
                      bgcolor: '#e8eaff',
                    }
                  }}
                >
                  {showForms ? "Hide Forms" : "Show Forms"}
                </Button>
              </Box>
              
              {showForms && (
                <Box sx={{ p: 3 }}>
                  <div className="row">
                    <div className="col-md-6">
                      {/* Create Slug Form */}
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          borderRadius: '12px', 
                          overflow: 'hidden',
                          border: '1px solid #e0e0e0',
                          mb: 3
                        }}
                      >
                        <Box sx={{ 
                          bgcolor: '#f5f5f5', 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0'
                        }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#6068bf' }}>
                            <i className="fa fa-plus-circle me-2"></i>
                            Create New Slug
                          </Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                          <form onSubmit={handleSubmit}>
                            <TextField
                              fullWidth
                              label="Slug Name"
                              variant="outlined"
                              value={formData.slug}
                              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                              required
                              sx={{
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#6068bf',
                                  },
                                },
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <i className="fa fa-tag" style={{ color: '#6068bf' }}></i>
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<i className="fa fa-save"></i>}
                              sx={{ 
                                borderRadius: '8px',
                                backgroundColor: '#6068bf',
                                '&:hover': {
                                  backgroundColor: '#4c53a9',
                                }
                              }}
                            >
                              Create Slug
                            </Button>
                          </form>
                        </Box>
                      </Paper>

                      {/* Add Inner Slug Form */}
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          borderRadius: '12px', 
                          overflow: 'hidden',
                          border: '1px solid #e0e0e0'
                        }}
                      >
                        <Box sx={{ 
                          bgcolor: '#f5f5f5', 
                          p: 2, 
                          borderBottom: '1px solid #e0e0e0'
                        }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#6068bf' }}>
                            <i className="fa fa-layer-group me-2"></i>
                            Add Inner Slug
                          </Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                          <FormControl 
                            fullWidth 
                            variant="outlined" 
                            sx={{
                              mb: 3,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '&.Mui-focused fieldset': {
                                  borderColor: '#6068bf',
                                },
                              },
                            }}
                          >
                            <InputLabel>Select Slug</InputLabel>
                            <Select
                              value={selectedSlug}
                              onChange={(e) => setSelectedSlug(e.target.value)}
                              label="Select Slug"
                              startAdornment={
                                <i className="fa fa-tag me-2" style={{ color: '#6068bf' }}></i>
                              }
                            >
                              <MenuItem value="">
                                <em>Select a Slug</em>
                              </MenuItem>
                              {Array.isArray(allSlugs) && allSlugs.map((slug) => (
                                <MenuItem key={slug._id} value={slug._id}>
                                  {slug.slug}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          
                          {selectedSlugData && Array.isArray(selectedSlugData.innerSlugs) && selectedSlugData.innerSlugs.length > 0 && (
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                                Existing Inner Slugs:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedSlugData.innerSlugs.map((innerSlug, idx) => (
                                  <Chip 
                                    key={idx} 
                                    label={innerSlug} 
                                    sx={{ 
                                      bgcolor: '#e8eaff',
                                      color: '#6068bf',
                                      fontWeight: 500,
                                      border: '1px solid #6068bf30'
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                          
                          <TextField
                            fullWidth
                            label="New Inner Slug Name"
                            variant="outlined"
                            value={newInnerSlug}
                            onChange={(e) => setNewInnerSlug(e.target.value)}
                            placeholder="Enter inner slug name"
                            sx={{
                              mb: 3,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '8px',
                                '&.Mui-focused fieldset': {
                                  borderColor: '#6068bf',
                                },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <i className="fa fa-tags" style={{ color: '#6068bf' }}></i>
                                </InputAdornment>
                              ),
                            }}
                          />
                          
                          <Button
                            variant="contained"
                            startIcon={<i className="fa fa-plus"></i>}
                            onClick={handleAddInnerSlug}
                            disabled={!selectedSlug || !newInnerSlug.trim()}
                            sx={{ 
                              borderRadius: '8px',
                              backgroundColor: '#6068bf',
                              '&:hover': {
                                backgroundColor: '#4c53a9',
                              },
                              '&.Mui-disabled': {
                                backgroundColor: '#e0e0e0',
                                color: '#9e9e9e'
                              }
                            }}
                          >
                            Add Inner Slug
                          </Button>
                        </Box>
                      </Paper>
                    </div>
                  </div>
                </Box>
              )}
            </Paper>

            {/* Slugs Table */}
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              <Box sx={{ 
                bgcolor: '#6068bf', 
                p: 2, 
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <i className="fa fa-list" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
                  Slugs List
                </Typography>
              </Box>
              
              <Box sx={{ p: 2 }}>
                <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(allSlugs) && allSlugs.length > 0 ? (
                        allSlugs.map((slug) => (
                          <TableRow key={slug._id} sx={{ '&:hover': { backgroundColor: '#f9f9ff' } }}>
                            <TableCell sx={{ fontSize: '0.8rem', color: '#666' }}>{slug._id}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  label={slug.slug}
                                  sx={{ 
                                    bgcolor: '#e8eaff',
                                    color: '#6068bf',
                                    fontWeight: 500,
                                    border: '1px solid #6068bf30'
                                  }}
                                />
                                {Array.isArray(slug.innerSlugs) && slug.innerSlugs.length > 0 && (
                                  <Chip 
                                    label={`${slug.innerSlugs.length} inner slugs`}
                                    size="small"
                                    sx={{ 
                                      bgcolor: '#f5f5f5',
                                      color: '#666',
                                      fontWeight: 400,
                                      border: '1px solid #ddd'
                                    }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleEdit(slug)}
                                  sx={{ 
                                    minWidth: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    color: '#6068bf',
                                    borderColor: '#6068bf',
                                    '&:hover': {
                                      backgroundColor: '#e8eaff',
                                      borderColor: '#6068bf'
                                    }
                                  }}
                                >
                                  <i className="fa fa-edit"></i>
                                </Button>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleDelete(slug._id)}
                                  sx={{ 
                                    minWidth: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    color: '#dc3545',
                                    borderColor: '#dc3545',
                                    '&:hover': {
                                      backgroundColor: '#ffebee',
                                      borderColor: '#dc3545'
                                    }
                                  }}
                                >
                                  <i className="fa fa-trash"></i>
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            <Box sx={{ py: 3 }}>
                              <Typography variant="body1" color="text.secondary">
                                No slugs found.
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          </div>
        </div>
      </div>

      {/* Edit Slug Modal */}
      <Dialog 
        open={showEditModal} 
        onClose={() => setShowEditModal(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
          }
        }}
      >
        <Box sx={{ bgcolor: '#6068bf', p: 2, color: 'white' }}>
          <DialogTitle sx={{ p: 0, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
            <i className="fa fa-edit"></i> Edit Slug
          </DialogTitle>
        </Box>
        <DialogContent sx={{ p: 3, mt: 1 }}>
          <TextField
            fullWidth
            label="Slug Name"
            variant="outlined"
            value={editFormData.slug}
            onChange={(e) => setEditFormData({ ...editFormData, slug: e.target.value, name: e.target.value })}
            required
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&.Mui-focused fieldset': {
                  borderColor: '#6068bf',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fa fa-tag" style={{ color: '#6068bf' }}></i>
                </InputAdornment>
              ),
            }}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Inner Slugs
          </Typography>
          
          <Paper 
            variant="outlined" 
            sx={{ 
              mb: 3, 
              maxHeight: '200px', 
              overflow: 'auto', 
              borderRadius: '8px',
              borderColor: '#e0e0e0'
            }}
          >
            <List dense disablePadding>
              {Array.isArray(editFormData.innerSlugs) && editFormData.innerSlugs.length > 0 ? (
                editFormData.innerSlugs.map((innerSlug, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText 
                        primary={innerSlug} 
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          size="small" 
                          onClick={() => handleRemoveEditInnerSlug(index)}
                          sx={{ color: '#dc3545' }}
                        >
                          <i className="fa fa-times"></i>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < editFormData.innerSlugs.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText 
                    primary="No inner slugs added yet." 
                    primaryTypographyProps={{ color: 'text.secondary', fontStyle: 'italic' }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="New Inner Slug"
              variant="outlined"
              value={newEditInnerSlug}
              onChange={(e) => setNewEditInnerSlug(e.target.value)}
              placeholder="Add new inner slug"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&.Mui-focused fieldset': {
                    borderColor: '#6068bf',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="fa fa-tag" style={{ color: '#6068bf' }}></i>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddEditInnerSlug}
              disabled={!newEditInnerSlug.trim()}
              sx={{ 
                borderRadius: '8px',
                backgroundColor: '#6068bf',
                '&:hover': {
                  backgroundColor: '#4c53a9',
                },
                '&.Mui-disabled': {
                  backgroundColor: '#e0e0e0',
                  color: '#9e9e9e'
                }
              }}
            >
              <i className="fa fa-plus"></i>
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            variant="outlined"
            onClick={() => setShowEditModal(false)}
            sx={{ 
              borderRadius: '8px',
              borderColor: '#6c757d',
              color: '#6c757d',
              '&:hover': {
                borderColor: '#5a6268',
                backgroundColor: '#f8f9fa',
              }
            }}
            startIcon={<i className="fa fa-times"></i>}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleUpdateSlug}
            sx={{ 
              borderRadius: '8px',
              backgroundColor: '#6068bf',
              '&:hover': {
                backgroundColor: '#4c53a9',
              }
            }}
            startIcon={<i className="fa fa-save"></i>}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 