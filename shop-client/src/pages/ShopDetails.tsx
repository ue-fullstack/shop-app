import { Box, Divider, Paper, Typography } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionButtons, ShopProducts } from '../components';
import { ShopService } from '../services';
import { Shop } from '../types';
import { useAppContext, useToastContext } from '../context';
import { pluralize } from '../utils';

const DAY: Record<number, string> = {
    1: 'Lundi',
    2: 'Mardi',
    3: 'Mercredi',
    4: 'Jeudi',
    5: 'Vendredi',
    6: 'Samedi',
    7: 'Dimanche',
};

const ShopDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const { setToast } = useToastContext();
    const [shop, setShop] = useState<Shop | null>(null);

    const getShop = (shopId: string) => {
        ShopService.getShop(shopId).then((res) => {
            // sort openingHours
            res.data.openingHours = res.data.openingHours.sort((a, b) => a.day - b.day);
            setShop(res.data);
        });
    };

    useEffect(() => {
        id && getShop(id);
    }, [id]);

    const displayHours = (hours: string): string => {
        return moment(hours, 'HH:mm').format('HH:mm');
    };

    const handleDelete = () => {
        setLoading(true);
        id &&
            ShopService.deleteShop(id)
                .then(() => {
                    navigate('/');
                    setToast({ severity: 'success', message: 'La boutique a bien été supprimée' });
                })
                .catch(() => {
                    setToast({ severity: 'error', message: 'Une erreur est survenue lors de la suppression' });
                })
                .finally(() => {
                    setLoading(false);
                });
    };

    const handleEdit = () => {
        navigate(`/shop/edit/${id}`);
    };

    if (!shop) return <></>;

    return (
        <Paper
            elevation={3}
            sx={{
                padding: 8,
                maxWidth: 950,
                margin: 'auto',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                position: 'relative', 
            }}
        >
            {/* Boutons d'action */}
            <ActionButtons handleDelete={handleDelete} handleEdit={handleEdit} />

            {/* Informations générales */}
            <Typography variant="h3" sx={{ textAlign: 'center', mb: 1, fontWeight: 'bold' }}>
                {shop.name}
            </Typography>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
                Cette boutique comporte {shop.nbProducts} {pluralize('produit', shop.nbProducts)}
            </Typography>
            <Typography sx={{ textAlign: 'center', my: 1, fontStyle: 'italic' }}>
                {shop.inVacations ? 'En congé actuellement' : "N'est pas en congé actuellement"}
            </Typography>
            <Typography sx={{ textAlign: 'center', my: 1 }} color="text.secondary">
                Boutique créée le : {moment(shop.createdAt).format('DD/MM/YYYY')}
            </Typography>

            {/* Séparateur */}
            <Divider sx={{ my: 1 }} />

            {/* Horaires d'ouverture */}
            <Box sx={{ textAlign: 'center', my: 1 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                    Horaires d&apos;ouverture :
                </Typography>
                {shop.openingHours.map((openingHour) => (
                    <Box
                        key={openingHour.id}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            maxWidth: 400,
                            margin: 'auto',
                            padding: 1,
                            borderBottom: '1px solid #e0e0e0',
                        }}
                    >
                        <Typography variant="body1">{DAY[openingHour.day]}</Typography>
                        <Typography variant="body1">
                            {displayHours(openingHour?.openAt)} - {displayHours(openingHour?.closeAt)}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Produits */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
                Les produits :
            </Typography>
            {id && <ShopProducts shopId={id} />}
        </Paper>
    );
};

export default ShopDetails;
