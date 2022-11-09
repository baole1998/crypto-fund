import React, { useCallback, useState, useEffect } from 'react';
import { Box, styled } from '@mui/system';
import { Button, Card, InputBase } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
// import './Compare.scss';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { debounce } from 'debounce';
import CloseIcon from '@mui/icons-material/Close';
import { ContentSearch, CompareTaskModel } from 'src/models/compare_task';
import { useLocation, useNavigate } from 'react-router';
import Breadcrumb from 'src/components/Breadcrum/Breadcrumb';
import ListDetailCompare from './list-detail-compare/ListDetailCompare';
import * as actionCompare from "src/redux/store/compare/compare.store"

const Container = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: {
        margin: '16px'
    },
    '& .breadcrumb': {
        marginBottom: '30px',
        [theme.breakpoints.down('sm')]: {
            marginBottom: '16px'
        }
    }
}));

const DetailCompare: React.FC = () => {
    const [detailCompares, setDetailCompares] = useState([]);
    const [showModalAddorEdit, setShowModalAddorEdit] = useState<boolean>(false);
    const [focused, setFocused] = useState<boolean>(false);
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [dataSearch, setDataSearch] = useState<ContentSearch>({
        description: '',
        name: '',
        version: 0,
        verified: '',
        env: '',
        from_date: new Date(),
        to_date: new Date()
    });
    const [searchChildren, setSearchChildren] = useState<ContentSearch>({
        description: '',
        name: '',
        version: 0,
        verified: '',
        env: '',
        from_date: new Date(),
        to_date: new Date()
    });
    const [page, setPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(20);
    const [totalItemCount, setTotalItemCount] = useState<number>(0);
    const location = useLocation()
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    useEffect(()=>{
        fetchCompareResult()
    },[])
    const onChangeSearchCallback = useCallback(
        (
            name: string, value: any
        ) => {
            onChangeSearch(name, value)
        }, [searchChildren, dataSearch]
    );
    const onChangeSearch = (name: string, value: any) => {
        if (name === 'name') {
            if (searchChildren.name === value) {
                setSearchChildren({
                    ...searchChildren,
                    name: ''
                });
            } else {
                setSearchChildren({
                    ...searchChildren,
                    name: value
                });
            }
        }
        if (name === 'version') {
            setSearchChildren({
                ...searchChildren,
                version: value
            });
        }
        if (name === 'verified') {
            if (searchChildren.verified === value) {
                setSearchChildren({
                    ...searchChildren,
                    verified: ''
                });
            } else {
                setSearchChildren({
                    ...searchChildren,
                    verified: value
                });
            }
        }
        if (name === 'env') {
            if (searchChildren.env === value) {
                setSearchChildren({
                    ...searchChildren,
                    env: ''
                });
            } else {
                setSearchChildren({
                    ...searchChildren,
                    env: value
                });
            }
        }
        if (name === 'description') {
            setDataSearch({
                ...dataSearch,
                description: value
            });
            debounceData(value);
        }
        if (name === 'from_date') {
            setSearchChildren({
                ...searchChildren,
                from_date: value
            });
        }
        if (name === 'to_date') {
            setSearchChildren({
                ...searchChildren,
                to_date: value
            });
        }
    };
    const debounceData = useCallback(
        debounce(
            (nextValue) =>
                onFetchDataCallback(
                    nextValue,
                    dataSearch.name,
                    dataSearch.version,
                    dataSearch.verified,
                    dataSearch.env,
                    rowsPerPage,
                    page
                ),
            1000
        ),
        []
    );
    const onFetchDataCallback = useCallback(
        (
            description: string,
            name: string,
            version: number,
            verified: string,
            env: string,
            rowsPerPage: number,
            page: number
        ) => {
            onFetchData(description, name, version, verified, env, rowsPerPage, page);
        },
        [dataSearch, rowsPerPage, page]
    );
    const onFetchData = (
        description: string,
        name: string,
        version: number,
        verified: string,
        env: string,
        rowsPerPage: number,
        page: number
    ) => {
        setPage(page);
        let param = `?page_size=${rowsPerPage}&page=${page}`;
        if (description) {
            param += `&description=${description}`;
        }
        if (name) {
            param += `&name=${name}`;
        }
        if (version) {
            param += `&version=${version}`;
        }
        if (verified) {
            param += `&verified=${verified}`;
        }
        if (env) {
            param += `&env=${env}`;
        }
        // actionsCompare.getCompare(param).then((res) => {
        //   console.log(res);
        //   if (res && res.data) {
        //     setDetailCompares(res.data);
        //     setTotalItemCount(res.metadata.total_items);
        //   }
        // });
    };
    const toggleOpenSearch = () => {
        setOpenSearch(!openSearch);
    };
    const onRemoveFilterEvent = (name: string) => {
        if (name === 'name') {
            setDataSearch({
                ...dataSearch,
                name: ''
            });
            setSearchChildren({
                ...searchChildren,
                name: ''
            });
            onFetchDataCallback(
                dataSearch.description,
                '',
                dataSearch.version,
                dataSearch.verified,
                dataSearch.env,
                rowsPerPage,
                page
            );
        }
        if (name === 'version') {
            setDataSearch({
                ...dataSearch,
                version: 0
            });
            setSearchChildren({
                ...searchChildren,
                version: 0
            });
            onFetchDataCallback(
                dataSearch.description,
                dataSearch.name,
                0,
                dataSearch.verified,
                dataSearch.env,
                rowsPerPage,
                page
            );
        }
        if (name === 'verified') {
            setDataSearch({
                ...dataSearch,
                verified: ''
            });
            setSearchChildren({
                ...searchChildren,
                verified: ''
            });
            onFetchDataCallback(
                dataSearch.description,
                dataSearch.name,
                dataSearch.version,
                '',
                dataSearch.env,
                rowsPerPage,
                page
            );
        }
        if (name === 'env') {
            setDataSearch({
                ...dataSearch,
                env: ''
            });
            setSearchChildren({
                ...searchChildren,
                env: ''
            });
            onFetchDataCallback(
                dataSearch.description,
                dataSearch.name,
                dataSearch.version,
                dataSearch.verified,
                '',
                rowsPerPage,
                page
            );
        }
        if (name === 'description') {
            setDataSearch({
                ...dataSearch,
                description: ''
            });
            onFetchDataCallback(
                '',
                dataSearch.name,
                dataSearch.version,
                dataSearch.verified,
                dataSearch.env,
                rowsPerPage,
                page
            );
        }
    };

    const fetchCompareResult = () => {
        let path = location?.pathname?.split('/')
        actionCompare.getCompareResult(path[path?.length - 1]).then(res => {
            console.log(res)
            setDetailCompares(res.data)
        })
    }
    return (
        <Container className="container-compare-page">
            <div className="tilte-page">
                <Breadcrumb routeSegments={[{ name: 'CHI TIẾT', path: '/compare' }]} />
            </div>
            <Card className="compare-table">
                <div className="e-table-header">
                    {/* <div className="d-flex e-header justify-content-between">

                        <div className="d-flex align-items-center">
                            <form className="from-search">
                                <Box
                                    className={`d-flex box-input-search ${focused ? 'input-focused' : ''
                                        }`}
                                >
                                    <InputBase
                                        type="text"
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        onChange={(e) =>
                                            onChangeSearchCallback('description', e.target.value)
                                        }
                                        name="query_contains"
                                        value={dataSearch.description}
                                        className="input-search"
                                        placeholder="Tìm kiếm theo mô tả..."
                                        startAdornment={<SearchIcon />}
                                    />
                                    <input type="submit" hidden value="Submit" />
                                </Box>
                            </form>
                            <div className="action-button" onClick={toggleOpenSearch}>
                                <FilterAltIcon />
                            </div>
                        </div>
                    </div> */}

                    <div className="item-result">
                        {dataSearch.description ? (
                            <span className="label-result">
                                Mô tả: {dataSearch.description}{' '}
                                <span onClick={() => onRemoveFilterEvent('description')}>
                                    <CloseIcon />
                                </span>
                            </span>
                        ) : (
                            ''
                        )}
                        {dataSearch.name ? (
                            <span className="label-result">
                                Đơn vị: {dataSearch.name}{' '}
                                <span onClick={() => onRemoveFilterEvent('name')}>
                                    <CloseIcon />
                                </span>
                            </span>
                        ) : (
                            ''
                        )}
                        {dataSearch.version ? (
                            <span className="label-result">
                                Version: {dataSearch.version}{' '}
                                <span onClick={() => onRemoveFilterEvent('version')}>
                                    <CloseIcon />
                                </span>
                            </span>
                        ) : (
                            ''
                        )}
                        {dataSearch.verified ? (
                            <span className="label-result">
                                Trạng thái:{' '}
                                {dataSearch.verified === 'approving' ? 'Chờ duyệt' : 'Đã duyệt'}{' '}
                                <span onClick={() => onRemoveFilterEvent('verified')}>
                                    <CloseIcon />
                                </span>
                            </span>
                        ) : (
                            ''
                        )}
                        {dataSearch.env ? (
                            <span className="label-result">
                                Môi trường: {dataSearch.env}{' '}
                                <span onClick={() => onRemoveFilterEvent('env')}>
                                    <CloseIcon />
                                </span>
                            </span>
                        ) : (
                            ''
                        )}
                    </div>
                </div>

                <Box overflow="auto" padding="15px">
                    <ListDetailCompare
                        // onFetchData={onFetchDataCallback}
                        page={page}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        // dataSearch={dataSearch}
                        setRowsPerPage={setRowsPerPage}
                        totalItemCount={totalItemCount}
                        // onOpenShowModalEdit={onOpenShowModalEdit}
                        detailCompares={detailCompares}
                    />
                </Box>
            </Card>
            {/* <SearchCompare
      openSearch={openSearch}
      onChangeSearch={onChangeSearchCallback}
      toggleOpenSearch={toggleOpenSearch}
      onCloseOpenSearch={onCloseOpenSearch}
      searchChildren={searchChildren}
      onSummitSearch={onFilter}
      onResetFilter={onResetFilter}
    /> */}
        </Container>
    );
};

export default DetailCompare;
