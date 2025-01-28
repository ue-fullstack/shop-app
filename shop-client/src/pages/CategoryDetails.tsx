import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext, useToastContext } from '../context';
import { CategoryService } from '../services';
import { Category } from '../types';
import { ActionButtons } from '../components';

const CategoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const { setToast } = useToastContext();
    const [category, setCategory] = useState<Category | null>(null);

    const getCategory = (categoryId: string) => {
        CategoryService.getCategory(categoryId).then((res) => {
            setCategory(res.data);
        });
    };

    useEffect(() => {
        id && getCategory(id);
    }, [id]);

    const handleDelete = () => {
        setLoading(true);
        id &&
            CategoryService.deleteCategory(id)
                .then(() => {
                    navigate('/category');
                    setToast({ severity: 'success', message: 'La catégorie a bien été supprimée' });
                })
                .catch(() => {
                    setToast({ severity: 'error', message: 'Une erreur est survenue lors de la suppression' });
                })
                .finally(() => {
                    setLoading(false);
                });
    };

    const handleEdit = () => {
        navigate(`/category/edit/${id}`);
    };

    if (!category) return <></>;

    return (
        <Paper
            elevation={3}
            sx={{
                padding: 4,
                maxWidth: 800,
                margin: 'auto',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                position: 'relative',
            }}
        >
            {/* Boutons d'action */}
            <ActionButtons handleDelete={handleDelete} handleEdit={handleEdit} />

            {/* Category Name */}
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                {category.name}
            </Typography>
        </Paper>
    );
};

export default CategoryDetails;
