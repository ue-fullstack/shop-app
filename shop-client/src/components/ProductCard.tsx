import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';
import { FormattedProduct, Product } from '../types';
import { formatterLocalizedProduct, priceFormatter } from '../utils';

type Props = {
    product: Product;
    displayShop?: boolean;
};

const ProductCard = ({ product, displayShop = false }: Props) => {
    const navigate = useNavigate();
    const { locale } = useAppContext();
    const [formattedProduct, setFormattedProduct] = useState<FormattedProduct>(
        formatterLocalizedProduct(product, locale),
    );

    useEffect(() => setFormattedProduct(formatterLocalizedProduct(product, locale)), [locale]);

    const handleClick = () => {
        navigate(`/product/${formattedProduct.id}`);
    };

    return (
        <Card
            sx={{
                minWidth: 275,
                maxWidth: 400,
                margin: 'auto',
                boxShadow: 3,
                borderRadius: 2,
                transition: '0.3s',
                height: displayShop ? 270 : 230,
                '&:hover': {
                    boxShadow: 6,
                },
                cursor: 'pointer',
            }}
            onClick={handleClick}
        >
            <CardContent>
                <Typography
                    variant="h4"
                    color="text.primary"
                    gutterBottom
                    sx={{ textAlign: 'center', fontWeight: 'bold' }}
                >
                    {formattedProduct.name}
                </Typography>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    Prix : {priceFormatter(formattedProduct.price)}
                </Typography>
                {formattedProduct.description && (
                    <Typography sx={{ my: 1.5, maxHeight: 50, overflow: 'hidden' }} color="text.secondary">
                        {formattedProduct.description}
                    </Typography>
                )}
                {displayShop && (
                    <Typography sx={{ my: 1.5, textAlign: 'center' }}>
                        Boutique : {formattedProduct.shop?.name ?? 'Aucune'}
                    </Typography>
                )}
                <Typography sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                    Catégories : {''}
                    {formattedProduct.categories.length === 0
                        ? 'Aucune'
                        : formattedProduct.categories.map((cat, index) => (
                              <span key={cat.id}>
                                  {cat.name}
                                  {index === formattedProduct.categories.length - 1 ? '' : ', '}
                              </span>
                          ))}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
