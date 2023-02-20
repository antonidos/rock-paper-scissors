import { Button, TextField } from "@mui/material";

export const MyContainedButton = (props) => (<Button
    variant="contained"
    {...props}
    sx={{
        backgroundColor: "#b34151",
        ":hover": {
            backgroundColor: "#8f3440"
        }
    }}>
</Button>)

export const MyTextField = (props) => (<TextField
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