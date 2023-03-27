import { useContext, useState } from "react"
import { useRouter } from "next/router";
import Head from "next/head"
import { ErrorOutline, Visibility, VisibilityOff } from "@mui/icons-material"
import { Box, Button, Chip, IconButton, InputAdornment, TextField, Typography, Stack } from "@mui/material"
import { useForm } from "react-hook-form"
import { PATH_AUTH} from 'src/routes/paths';
import Link from 'next/link';

import LoginLayout from "src/layouts/login/LoginLayout"
import Image from "src/components/image/Image";
import { AuthContext } from "./context";
import { ClaveModal } from "../../custom/components/Usuarios";

type FormValues = {
    identificacion: string
    clave: string
}

export const Login = () => {
    const router = useRouter();
    const { loginUser } = useContext(AuthContext);
    const { register, formState: { errors }, handleSubmit, reset} = useForm<FormValues>();
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState(false);
    const [open, setOpen] = useState(false);




    const handleClick = () => {
        setShowPassword((show) => !show);
    };

    const handleSubmitLogin = async ({ identificacion, clave }: FormValues) => {
        const isValidLogin = await loginUser(identificacion, clave);
        if (!isValidLogin) {
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 3000);
            return;
        }
        router.replace('/admin');
    }
    
   
  const handleOpenModal = () => {
    
      setOpen(true);
      reset();
  };

  const handleCloseModal =  () => {
    setOpen(false);
  };

    

    return (
        <LoginLayout illustration="/logo/logo.webp">
            <Head>
                <title>Inicio de sesión</title>
            </Head>
            <Box component="div">
                <Box
                    component='div'
                    display={{ xs: 'flex', md: 'none' }}
                    justifyContent='center'
                    mb={2}
                >
                    <Image
                        disabledEffect
                        visibleByDefault
                        alt="auth"
                        src='/logo/logo.webp'
                        sx={{ maxWidth: 250, width: '100%' }}
                    />
                </Box>
                <Typography component="h1" variant="h4">Iniciar Sesión</Typography>
                <Chip
                    label="El usuario o la contraseña son incorrectos"
                    color="error"
                    icon={<ErrorOutline />}
                    className="fadeIn"
                    style={{ marginTop: 4, marginBottom: 4 }}
                    sx={{ display: showError ? 'flex' : 'none' }}
                />
                <Box component="form" onSubmit={handleSubmit(handleSubmitLogin)} marginTop={2} display="grid" gap={2}>
                    <TextField
                        fullWidth
                        label="Cédula o RUC"
                        type="number"
                        variant="outlined"
                        margin="dense"
                        {...register('identificacion', {
                            required: 'La indentificación es requerida'
                        })}
                        error={!!errors.identificacion}
                        helperText={errors.identificacion?.message}
                    />

                    <TextField
                        fullWidth
                        label="Contraseña"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClick}
                                    edge="end"
                                >
                                    {/* eslint-disable-next-line */}
                                    {showPassword ? <VisibilityOff color={!!errors.clave ? "error" : "inherit"} /> : <Visibility color={!!errors.clave ? "error" : "inherit"} />}
                                </IconButton>
                            </InputAdornment>
                        }}
                        {...register('clave', {
                            required: 'La contraseña es requerida'
                        })}
                        error={!!errors.clave}
                        helperText={errors.clave?.message}
                    />
                    <Button type="submit" size="large" variant="contained" color="secondary">Iniciar Sesión</Button>

                    <Link href={PATH_AUTH.registro} passHref legacyBehavior>
                        <Button type="button" size="large"   variant="outlined" color="secondary" >Registrarse</Button>
                    </Link>
                    <Stack direction="row" justifyContent="right">
                    
                        <Button type="button" color="secondary"  onClick={handleOpenModal}>
                            ¿Olvidé mi contraseña?
                        </Button>

                        <ClaveModal abrirM={open} onClose={handleCloseModal}/>

                    </Stack>

                </Box>
            </Box>
        </LoginLayout>
    )
}
