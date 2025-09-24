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
import { getAdminSlug } from "../../Store/ActionCreators/AdminSlugActionCreators";
import { addAdminSubSlug, deleteAdminSubSlug, getAdminSubSlug, getAdminSubSlugByParent, updateAdminSubSlug } from "../../Store/ActionCreators/AdminSlugActionCreators";

export default function SubSlugs() {
  const dispatch = useDispatch();
  const allSlugs = useSelector((state) => state.AdminSlugStateData);
  const allSubSlugs = useSelector((state) => state.AdminSubSlugStateData);

  const [selectedSlug, setSelectedSlug] = useState("");
  const [selectedSubSlug, setSelectedSubSlug] = useState("");
  const [newSubSlug, setNewSubSlug] = useState("");
  const [newInnerSubSlug, setNewInnerSubSlug] = useState("");
  const [showForms, setShowForms] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ _id: "", name: "", slug: "", parentSlug: "", innerSubSlugs: [] });
  const [newEditInnerSubSlug, setNewEditInnerSubSlug] = useState("");

  useEffect(() => {
    dispatch(getAdminSlug());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSlug) {
      dispatch(getAdminSubSlugByParent(selectedSlug));
    } else {
      dispatch(getAdminSubSlug());
      setSelectedSubSlug("");
    }
  }, [selectedSlug, dispatch]);

  const handleCreateSubSlug = async () => {
    if (!selectedSlug || !newSubSlug.trim()) return;

    const payload = { name: newSubSlug.trim(), parentSlug: selectedSlug };
    console.log("Payload before dispatching addAdminSubSlug:", payload);
    dispatch(addAdminSubSlug(payload));
    setNewSubSlug("");
  };

  const handleAddInnerSubSlug = async () => {
    if (!selectedSubSlug || !newInnerSubSlug.trim()) return;

    const subSlugToUpdate = allSubSlugs.find(subSlug => subSlug._id === selectedSubSlug);
    if (subSlugToUpdate) {
      const updatedInnerSubSlugs = [...(subSlugToUpdate.innerSubSlugs || []), newInnerSubSlug.trim()];
      dispatch(updateAdminSubSlug({ ...subSlugToUpdate, innerSubSlugs: updatedInnerSubSlugs }));
      setNewInnerSubSlug("");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sub-slug?")) {
      dispatch(deleteAdminSubSlug({ _id: id }));
    }
  };

  const handleEdit = (subSlug) => {
    setEditFormData({ ...subSlug });
    setNewEditInnerSubSlug("");
    setShowEditModal(true);
  };

  const handleUpdateSubSlug = () => {
    const updatedSubSlugData = { ...editFormData, name: editFormData.slug };
    dispatch(updateAdminSubSlug(updatedSubSlugData));
    setShowEditModal(false);
  };

  const handleAddEditInnerSubSlug = () => {
    if (!newEditInnerSubSlug.trim()) return;
    setEditFormData(prev => ({
      ...prev,
      innerSubSlugs: [...(prev.innerSubSlugs || []), newEditInnerSubSlug.trim()]
    }));
    setNewEditInnerSubSlug("");
  };

  const handleRemoveEditInnerSubSlug = (index) => {
    setEditFormData(prev => ({
      ...prev,
      innerSubSlugs: prev.innerSubSlugs.filter((_, i) => i !== index)
    }));
  };

  const selectedSubSlugData = allSubSlugs.find(subSlug => subSlug._id === selectedSubSlug);

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
                    Sub Slugs Management
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
                      {/* Create Sub Slug Form */}
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
                            Create New Sub Slug
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
                            <InputLabel>Select Parent Slug</InputLabel>
                            <Select
                              value={selectedSlug}
                              onChange={(e) => {
                                setSelectedSlug(e.target.value);
                                setSelectedSubSlug("");
                              }}
                              label="Select Parent Slug"
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
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                              fullWidth
                              label="Sub Slug Name"
                              variant="outlined"
                              value={newSubSlug}
                              onChange={(e) => setNewSubSlug(e.target.value)}
                              placeholder="Enter sub slug"
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
                              onClick={handleCreateSubSlug}
                              disabled={!selectedSlug || !newSubSlug.trim()}
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
                        </Box>
                      </Paper>

                      {/* Add Inner Sub Slug Form */}
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
                            Add Inner Sub Slug
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
                            <InputLabel>Select Sub Slug</InputLabel>
                            <Select
                              value={selectedSubSlug}
                              onChange={(e) => setSelectedSubSlug(e.target.value)}
                              label="Select Sub Slug"
                              startAdornment={
                                <i className="fa fa-tag me-2" style={{ color: '#6068bf' }}></i>
                              }
                            >
                              <MenuItem value="">
                                <em>Select a Sub Slug</em>
                              </MenuItem>
                              {Array.isArray(allSubSlugs) && allSubSlugs.map((subSlug) => (
                                <MenuItem key={subSlug._id} value={subSlug._id}>
                                  {subSlug.slug}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          
                          {selectedSubSlugData && Array.isArray(selectedSubSlugData.innerSubSlugs) && selectedSubSlugData.innerSubSlugs.length > 0 && (
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                                Existing Inner Sub Slugs:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedSubSlugData.innerSubSlugs.map((innerSubSlug, idx) => (
                                  <Chip 
                                    key={idx} 
                                    label={innerSubSlug} 
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
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                              fullWidth
                              label="Inner Sub Slug Name"
                              variant="outlined"
                              value={newInnerSubSlug}
                              onChange={(e) => setNewInnerSubSlug(e.target.value)}
                              placeholder="Enter inner sub slug"
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
                                    <i className="fa fa-tags" style={{ color: '#6068bf' }}></i>
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <Button
                              variant="contained"
                              onClick={handleAddInnerSubSlug}
                              disabled={!selectedSubSlug || !newInnerSubSlug.trim()}
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
                        </Box>
                      </Paper>
                    </div>
                  </div>
                </Box>
              )}
            </Paper>

            {/* Sub Slugs Table */}
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
                  Sub Slugs List
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
                      {Array.isArray(allSubSlugs) && allSubSlugs.length > 0 ? (
                        allSubSlugs.map((subSlug) => (
                          <TableRow key={subSlug._id} sx={{ '&:hover': { backgroundColor: '#f9f9ff' } }}>
                            <TableCell sx={{ fontSize: '0.8rem', color: '#666' }}>{subSlug._id}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  label={subSlug.slug}
                                  sx={{ 
                                    bgcolor: '#e8eaff',
                                    color: '#6068bf',
                                    fontWeight: 500,
                                    border: '1px solid #6068bf30'
                                  }}
                                />
                                {Array.isArray(subSlug.innerSubSlugs) && subSlug.innerSubSlugs.length > 0 && (
                                  <Chip 
                                    label={`${subSlug.innerSubSlugs.length} inner sub slugs`}
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
                                  onClick={() => handleEdit(subSlug)}
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
                                  onClick={() => handleDelete(subSlug._id)}
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
                                No sub slugs found.
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

      {/* Edit Sub Slug Modal */}
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
            <i className="fa fa-edit"></i> Edit Sub Slug
          </DialogTitle>
        </Box>
        <DialogContent sx={{ p: 3, mt: 1 }}>
          <TextField
            fullWidth
            label="Sub Slug Name"
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
            Inner Sub Slugs
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
              {Array.isArray(editFormData.innerSubSlugs) && editFormData.innerSubSlugs.length > 0 ? (
                editFormData.innerSubSlugs.map((innerSubSlug, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText 
                        primary={innerSubSlug} 
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          size="small" 
                          onClick={() => handleRemoveEditInnerSubSlug(index)}
                          sx={{ color: '#dc3545' }}
                        >
                          <i className="fa fa-times"></i>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < editFormData.innerSubSlugs.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText 
                    primary="No inner sub slugs added yet." 
                    primaryTypographyProps={{ color: 'text.secondary', fontStyle: 'italic' }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="New Inner Sub Slug"
              variant="outlined"
              value={newEditInnerSubSlug}
              onChange={(e) => setNewEditInnerSubSlug(e.target.value)}
              placeholder="Add new inner sub slug"
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
              onClick={handleAddEditInnerSubSlug}
              disabled={!newEditInnerSubSlug.trim()}
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
            onClick={handleUpdateSubSlug}
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