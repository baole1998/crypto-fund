import React from 'react'
import { styled, useTheme } from '@mui/system'
import { Icon, Breadcrumbs, Hidden } from '@mui/material'
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const BreadcrumbRoot = styled('div')(() => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: "1rem"
}))

const BreadcrumbName = styled('h4')(() => ({
    margin: 0,
    fontSize: '16px',
    paddingBottom: '1px',
    verticalAlign: 'middle',
    textTransform: 'capitalize'
}))

const SubName = styled('span')(({ theme }) => ({
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
}))

const Separator = styled('h4')(({ theme }) => ({
    margin: 0,
    marginLeft: 8,
    paddingBottom: '3px',
    color: theme.palette.text.hint
}))

const StyledIcon = styled(Icon)(() => ({
    marginLeft: 8,
    marginBottom: '4px',
    verticalAlign: 'middle',
}))

const Breadcrumb = ({ routeSegments }) => {
    const theme = useTheme()
    const hint = theme.palette.text.hint
    return (
        <BreadcrumbRoot>
            {/* {routeSegments ? (
                <Hidden xsDown>
                    <BreadcrumbName>
                        {routeSegments[routeSegments.length - 1]['name']}
                    </BreadcrumbName>
                    <Separator>|</Separator>
                </Hidden>
            ) : null} */}
            <Breadcrumbs
                separator={<NavigateNextIcon />}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative'
                }}
            >
                <NavLink to={routeSegments[0]?.path || "/"}>
                    {/* <StyledIcon color="primary">
                        home
                    </StyledIcon> */}
                    <HomeIcon />
                </NavLink>
                {routeSegments
                    ? routeSegments.map((route, index) => {
                        return index !== routeSegments.length - 1 ? (
                            <NavLink key={index} to={route.path} state={route.state}>
                                <SubName>
                                    {route.name}
                                </SubName>
                            </NavLink>
                        ) : (
                            <SubName key={index}>
                                {route.name}
                            </SubName>
                        )
                    })
                    : null}
            </Breadcrumbs>
        </BreadcrumbRoot>
    )
}

export default Breadcrumb
