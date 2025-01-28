import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ActionButtons } from '../components';
import { useAppContext, useToastContext } from '../context';
import { ProductService } from '../services';
import { FormattedProduct, Product } from '../types';
import { formatterLocalizedProduct, priceFormatter } from '../utils';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setLoading, locale } = useAppContext();
    const { setToast } = useToastContext();
    const [product, setProduct] = useState<Product | null>(null);
    const [formattedProduct, setFormattedProduct] = useState<FormattedProduct | null>();

    const getProduct = (productId: string) => {
        ProductService.getProduct(productId).then((res) => {
            setProduct(res.data);
        });
    };

    useEffect(() => {
        id && getProduct(id);
    }, [id]);

    useEffect(() => {
        product && setFormattedProduct(formatterLocalizedProduct(product, locale));
    }, [locale, product]);

    const handleDelete = () => {
        setLoading(true);
        id &&
            ProductService.deleteProduct(id)
                .then(() => {
                    navigate('/product');
                    setToast({ severity: 'success', message: 'Le produit a bien été supprimé' });
                })
                .catch(() => {
                    setToast({ severity: 'error', message: 'Une erreur est survenue lors de la suppresion' });
                })
                .finally(() => {
                    setLoading(false);
                });
    };

    const handleEdit = () => {
        navigate(`/product/edit/${id}`);
    };

    if (!formattedProduct) return <></>;

    return (
        <Paper elevation={3} sx={{ position: 'relative', padding: 6, maxWidth: 850, margin: 'auto', borderRadius: 2 }}>
        <Box sx={{ position: 'relative', top: 10, right: 10 }}>
            <ActionButtons handleDelete={handleDelete} handleEdit={handleEdit} />
        </Box>
    
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
            {formattedProduct.name}
        </Typography>
    
        <Divider sx={{ my: 3 }} />
    
        <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                    Prix
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {priceFormatter(formattedProduct.price)}
                </Typography>
            </Grid>
    
            <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                    Boutique
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {formattedProduct.shop?.name ? (
                        <Link to={`/shop/${formattedProduct.shop?.id}`} 
                            style={{
                                color: '#1976d2', 
                                textDecoration: 'none', 
                                fontWeight: 500, 
                                transition: 'color 0.3s'
                            }} 
                        >
                            {formattedProduct.shop?.name}
                        </Link>
                    ) : (
                        <span style={{ color: '#555' }}>N'appartient à aucune boutique</span>
                    )}
                </Typography>
            </Grid>
    
            {formattedProduct.description && (
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                        Description
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
                        {formattedProduct.description}
                    </Typography>
                </Grid>
            )}
    
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                    Catégories
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {formattedProduct.categories.length === 0
                        ? 'Aucune'
                        : formattedProduct.categories.map((cat, index) => (
                            <Fragment key={cat.id}>
                                <Link 
                                    to={`/category/${cat.id}`} 
                                    style={{
                                        color: '#1976d2', 
                                        textDecoration: 'none', 
                                        fontWeight: 500, 
                                        transition: 'color 0.3s'
                                    }} 
                                >
                                    {cat.name}
                                </Link>
                                {index < formattedProduct.categories.length - 1 && ', '}
                            </Fragment>
                        ))}
                </Typography>
            </Grid>
        </Grid>
    </Paper>
    
    );
};

export default ProductDetails;
