import { Button, ButtonProps, TextField, TextFieldProps } from "@mui/material";
import * as React from "react";

export const MyContainedButton = (props: ButtonProps) => (<Button
    variant="contained"
    {...props}
    sx={{
        backgroundColor: "#b34151",
        ":hover": {
            backgroundColor: "#8f3440"
        }
    }}>
</Button>)

export const MyTextField = (props: TextFieldProps) => (<TextField
    {...props}
    sx={{
        '& label.Mui-focused': {
            color: '#8f3440',
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#8f3440',
            },
        }
    }}>
</TextField>)