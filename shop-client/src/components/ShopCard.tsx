import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Shop } from '../types';
import { pluralize } from '../utils';

type Props = {
    shop: Shop;
};

const ShopCard = ({ shop }: Props) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/shop/${shop.id}`);
    };

    return (
        <Card
            sx={{
                minWidth: 300,
                maxWidth: 400,
                margin: 'auto',
                boxShadow: 3,
                borderRadius: 2,
                transition: '0.3s',
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
                    {shop.name}
                </Typography>
                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    {shop.nbProducts} {pluralize('produit', shop.nbProducts)}
                </Typography>
                <Typography sx={{ my: 1.5, textAlign: 'center' }} color="text.secondary">
                    Créée le : {moment(shop.createdAt).format('DD/MM/YYYY')}
                </Typography>
                <Typography sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                    En congé : <strong>{shop.inVacations ? 'Oui' : 'Non'}</strong>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ShopCard;
