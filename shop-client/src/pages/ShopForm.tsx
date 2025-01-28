import {
    Box,
    Button,
    Divider,
    Fab,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShopService } from '../services';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { MinimalShop, ObjectPropertyString } from '../types';
import { useAppContext, useToastContext } from '../context';

const schema = (shop: MinimalShop) => ({
    name: shop.name ? '' : 'Ce champ est requis',
});

const ShopForm = () => {
    const { id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const { setToast } = useToastContext();
    const [errors, setErrors] = useState<ObjectPropertyString<MinimalShop>>();
    const [shop, setShop] = useState<MinimalShop>({
        name: '',
        inVacations: false,
        openingHours: [],
    });

    const getShop = (shopId: string) => {
        setLoading(true);
        ShopService.getShop(shopId)
            .then((res) => {
                setShop({
                    ...res.data,
                    id: id,
                });
            })
            .finally(() => setLoading(false));
    };

    const createShop = () => {
        setLoading(true);
        ShopService.createShop(shop)
            .then(() => {
                navigate('/');
                setToast({ severity: 'success', message: 'La boutique a bien été créée' });
            })
            .catch(() => {
                setToast({ severity: 'error', message: 'Une erreur est survenue lors de la création' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const editShop = () => {
        setLoading(true);
        ShopService.editShop(shop)
            .then(() => {
                navigate(`/shop/${id}`);
                setToast({ severity: 'success', message: 'La boutique a bien été modifiée' });
            })
            .catch(() => {
                setToast({ severity: 'error', message: 'Une erreur est survenue lors de la modification' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        !isAddMode && id && getShop(id);
    }, [isAddMode]);

    const handleChange = (index: number, key: string, value: number | string | undefined) => {
        const openingHours = shop.openingHours;
        const openingHour = {
            ...openingHours[index],
            [key]: value,
        };
        openingHours[index] = openingHour;
        setShop({ ...shop, openingHours });
    };

    const handleClickAddHours = () => {
        setShop({ ...shop, openingHours: [...shop.openingHours, { day: 1, openAt: '09:00:00', closeAt: '18:00:00' }] });
    };

    const handleClickClearHours = (index: number) => {
        setShop({ ...shop, openingHours: shop.openingHours.filter((o, i) => i !== index) });
    };

    const validate = () => {
        setErrors(schema(shop));
        return Object.values(schema(shop)).every((o) => o == '');
    };

    const validateOpeningHours = () => {
        const openingHours = shop.openingHours;
        for (let i = 0; i < openingHours.length; i++) {
            for (let j = i + 1; j < openingHours.length; j++) {
                if (openingHours[i].day === openingHours[j].day) {
                    const openAt1 = new Date(`1970-01-01T${openingHours[i].openAt}Z`).getTime();
                    const closeAt1 = new Date(`1970-01-01T${openingHours[i].closeAt}Z`).getTime();
                    const openAt2 = new Date(`1970-01-01T${openingHours[j].openAt}Z`).getTime();
                    const closeAt2 = new Date(`1970-01-01T${openingHours[j].closeAt}Z`).getTime();

                    if (openAt1 < closeAt2 && openAt2 < closeAt1) {
                        setToast({ severity: 'error', message: 'Les horaires se chevauchent pour le même jour' });
                        return false;
                    }
                }
            }
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validate() || !validateOpeningHours()) return;
        if (isAddMode) {
            createShop();
        } else {
            editShop();
        }
    };

    return (
        <>
        <Paper elevation={1} sx={{
            padding: 4,
            maxWidth: 950,
            margin: 'auto',
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
        }}>
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 3 }}>
                {isAddMode ? 'Ajouter une boutique' : 'Modifier la boutique'}
            </Typography>

            <Box sx={{ display: 'block', ml: 'auto', mr: 'auto', width: '80%', mb: 3 }}>
                <Divider>Informations de la boutique</Divider>
                <FormControl sx={{ mt: 2, width: '100%' }}>
                    <TextField
                        autoFocus
                        required
                        label="Nom"
                        value={shop.name}
                        onChange={(e) => setShop({ ...shop, name: e.target.value })}
                        fullWidth
                        error={!!errors?.name}
                        helperText={errors?.name}
                        sx={{ marginBottom: 3 }}
                    />

                    <FormControlLabel
                        value="start"
                        control={
                            <Switch
                                checked={shop.inVacations}
                                onChange={(e) => setShop({ ...shop, inVacations: e.target.checked })}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label="En congé"
                        sx={{ marginBottom: 2 }}
                    />
                </FormControl>

                {/* OpeningHours */}
                <Divider>Horaires d'ouverture de la boutique</Divider>
                <Box sx={{ mt: 1, mb: 3, display: 'flex', justifyContent: 'center' }}>
                    <Fab size="small" color="primary" aria-label="add">
                        <AddIcon onClick={handleClickAddHours} />
                    </Fab>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 3 }}>
                    {shop.openingHours.map((openingHour, index) => (
                        <Paper elevation={2} key={index} sx={{ position: 'relative', padding: 3 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                }}
                            >
                                <FormControl sx={{ minWidth: 125 }}>
                                    <InputLabel id="demo-simple-select-label">Jour</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={openingHour.day}
                                        label="Jour"
                                        onChange={(e) => handleChange(index, 'day', e.target.value)}
                                    >
                                        <MenuItem value={1}>Lundi</MenuItem>
                                        <MenuItem value={2}>Mardi</MenuItem>
                                        <MenuItem value={3}>Mercredi</MenuItem>
                                        <MenuItem value={4}>Jeudi</MenuItem>
                                        <MenuItem value={5}>Vendredi</MenuItem>
                                        <MenuItem value={6}>Samedi</MenuItem>
                                        <MenuItem value={7}>Dimanche</MenuItem>
                                    </Select>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="Ouvre à"
                                        ampm={false}
                                        value={`2014-08-18T${openingHour.openAt}`}
                                        onChange={(v: Dayjs | null) =>
                                            handleChange(index, 'openAt', v?.format('HH:mm:ss'))
                                        }
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="Ferme à"
                                        ampm={false}
                                        value={`2014-08-18T${openingHour.closeAt}`}
                                        onChange={(v: Dayjs | null) =>
                                            handleChange(index, 'closeAt', v?.format('HH:mm:ss'))
                                        }
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </Box>

                            <Fab size="small" color="warning" sx={{ position: 'absolute', top: 7, right: 7 }}>
                                <ClearIcon onClick={() => handleClickClearHours(index)} />
                            </Fab>
                        </Paper>
                    ))}
                </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" onClick={handleSubmit}>
                    Valider
                </Button>
            </Box>
        </Paper>
    </>
    );
};

export default ShopForm;
