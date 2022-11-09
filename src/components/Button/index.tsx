import { FC, ReactElement } from "react";
import { Typography, Button } from '@mui/material';
import { styled } from "@mui/system";

interface ButtonProps {
    title: String,
    type: 'text' | 'outlined' | 'contained',
    rightIcon?: ReactElement,
    leftIcon?: ReactElement,
    onClick: () => void,
    styles?: Object
}

type ButtonStyles = {
    styles: {
        backgroundColor?: string,
        color?: string,
        border?: string,
        hoverBackgroundColor?: string,
        hoverColor?: string
    }

}

const StyledButton = styled(Button)<ButtonStyles>(({ styles }) => ({
    borderRadius: "5px",
    backgroundColor: styles?.backgroundColor || '#212943',
    border: styles?.border,
    color: styles?.color || "#fff",
    '&:hover': {
        backgroundColor: styles?.hoverBackgroundColor || "#0c101a",
        color: styles?.hoverColor
    }
}))

const CustomButton: FC<ButtonProps> = ({
    title,
    type,
    rightIcon,
    leftIcon,
    onClick,
    styles,
    ...rest
}) => {
    return (
        <StyledButton
            styles={styles}
            variant={type}
            onClick={onClick}
            {...rest}>
            {leftIcon}
            <Typography variant="button" display="block" >{title}</Typography>
            {rightIcon}
        </StyledButton>)

}

export default CustomButton