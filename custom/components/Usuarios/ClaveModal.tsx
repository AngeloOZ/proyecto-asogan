
import { useState, useEffect } from "react"
import {Button,  Typography, DialogContent, DialogActions, Dialog,TextField, Box,DialogTitle,IconButton } from "@mui/material"
import { styled } from '@mui/material/styles';
import { useForm } from "react-hook-form"

import { handleErrorsAxios } from 'utils';

import { PATH_AUTH } from "src/routes/paths";
import { useRouter } from 'next/router';
import CloseIcon from '@mui/icons-material/Close';
import {subastaAPI } from "custom/api"
import { useSnackbar } from '../../../src/components/snackbar';

type Props = {
    abrirM?: boolean;
    onClose?: any;
}

type FormValues = {
    identificacionC: string
    correoC: string
}

interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
  }
  

function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;
  
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }

export const ClaveModal = ({abrirM = false, onClose = false}:Props) =>{
    const [openModal, setOpenModal] = useState(false);
    const { register, formState: { errors }, handleSubmit,reset } = useForm<FormValues>();
    const { enqueueSnackbar } = useSnackbar();

    const { push } = useRouter();
  
    useEffect(() => {
        setOpenModal(abrirM)
    
    }, [abrirM, reset])
    
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        },
        '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
        },
    }));
  
  const handleClose = () => {
        setOpenModal(onClose);
        reset()
    };

            const enviarDatos = async  ({ identificacionC, correoC }: FormValues) =>{
                    try {
                        const usuario = await subastaAPI.get(`/user/clave?identificacion= ${identificacionC}&correo=${correoC}`);
                  
                    if (usuario && usuario.data.tipo ===2 ){
                        usuario.data.clave =  usuario.data.identificacion
                         

                        usuario.data.rol = 'comprador'


                        
                          await subastaAPI.put('/user', usuario.data); 
                    
                        const correo =  await subastaAPI.post('/correo', usuario.data);
                      
                            if(correo.status === 200)
                            {
                                enqueueSnackbar('Se ha enviado a su correo eléctronico su contraseña, por favor verifique', { variant: 'success' });
                                handleClose();
                                push(PATH_AUTH.login);

                            }else{
                                enqueueSnackbar(`${correo}`, { variant: 'success' });
                            }
                        }else{
                            enqueueSnackbar('No se encontró un usuario con la información proporcionada, o no es comprador', { variant: 'error' });
                        }
                    } catch (error) {
                      
                        enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
                    
                    } 
            }

return(
                        <BootstrapDialog
            
                            onClose={handleClose}
                            aria-labelledby="customized-dialog-title"
                            open={openModal}
                        >
                        <Box component="form"  marginTop={2} display="grid" gap={2}>
                            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                            Cambio de Clave
                            </BootstrapDialogTitle>
                            <DialogContent dividers>
                            <Typography gutterBottom>
                               Para verificar su información es necesario que digite los siguientes datos:
                            </Typography>
                            <TextField
                                fullWidth
                                label="Cédula o RUC"
                                type="number"
                                variant="outlined"
                                margin="dense"
                                {...register('identificacionC', {
                                    required: 'La indentificación es requerida'
                                })}
                                error={!!errors.identificacionC}
                                helperText={errors.identificacionC?.message}
                             />
                         
                            <TextField
                                fullWidth
                                label="Correo"
                                type="string"
                                variant="outlined"
                                margin="dense"
                                {...register('correoC', {
                                    required: 'El correo es requerido'
                                })}
                                error={!!errors.correoC}
                                helperText={errors.correoC?.message}
                             />
                            </DialogContent>
                            <DialogActions>
                            <Button type="button" variant="contained" color="secondary" onClick={handleSubmit(enviarDatos)}>
                                Enviar
                            </Button>
                            </DialogActions>
                            </Box> 
                        </BootstrapDialog>

                     
                        
)
    
}