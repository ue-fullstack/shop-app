import { Box, Button, Divider, FormControl, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext, useToastContext } from '../context';
import { CategoryService } from '../services';
import { MinimalCategory, ObjectPropertyString } from '../types';

const schema = (category: MinimalCategory) => ({
    name: category.name ? '' : 'Ce champ est requis',
});

const CategoryForm = () => {
    const { id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const { setToast } = useToastContext();
    const [errors, setErrors] = useState<ObjectPropertyString<MinimalCategory>>();
    const [category, setCategory] = useState<MinimalCategory>({
        name: '',
    });

    const getCategory = (categoryId: string) => {
        setLoading(true);
        CategoryService.getCategory(categoryId)
            .then((res) => {
                setCategory({
                    ...res.data,
                    id: id,
                });
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        !isAddMode && id && getCategory(id);
    }, [isAddMode]);

    const createCategory = () => {
        setLoading(true);
        CategoryService.createCategory(category)
            .then(() => {
                navigate('/category');
                setToast({ severity: 'success', message: 'La catégorie a bien été créée' });
            })
            .catch(() => {
                setToast({ severity: 'error', message: 'Une erreur est survenue lors de la création' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const editCategory = () => {
        setLoading(true);
        CategoryService.editCategory(category)
            .then(() => {
                navigate(`/category/${id}`);
                setToast({ severity: 'success', message: 'La catégorie a bien été modifiée' });
            })
            .catch(() => {
                setToast({ severity: 'error', message: 'Une erreur est survenue lors de la modification' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const validate = () => {
        setErrors(schema(category));
        return Object.values(schema(category)).every((o) => o == '');
    };

    const handleSubmit = () => {
        if (!validate()) return;
        if (isAddMode) {
            createCategory();
        } else {
            editCategory();
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: 'auto', borderRadius: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: 3, textAlign: 'center', fontWeight: 'bold' }}>
                {isAddMode ? 'Ajouter une catégorie' : 'Modifier la catégorie'}
            </Typography>

            <FormControl
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    ml: 'auto',
                    mr: 'auto',
                    width: '100%',
                    mb: 3,
                }}
            >
                <Divider sx={{ marginBottom: 2 }}>Informations de la catégorie</Divider>

                <TextField
                    autoFocus
                    required
                    label="Nom de la catégorie"
                    value={category.name}
                    onChange={(e) => setCategory({ ...category, name: e.target.value })}
                    error={!!errors?.name}
                    helperText={errors?.name}
                    sx={{ marginBottom: 3 }}
                />
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ padding: '10px 20px', fontSize: '1rem' }}
                >
                    {isAddMode ? 'Ajouter' : 'Modifier'}
                </Button>
            </Box>
        </Paper>
    );
};

export default CategoryForm;
