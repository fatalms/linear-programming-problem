import React, { useContext, useEffect, useRef, useState } from "react";
import Equations from "../components/Equations";
import Context from "../context/solution/solutionContext";
import ArtificalData from "../modules/artificalData";
import SimplexData from "../modules/simplexData";
import ArtificalTable from "../components/simplex/ArtificalTable";
import Button from "react-bootstrap/Button";
import SimplexMethod from "../components/simplex/SimplexMethod";
import { AUTO_MODE } from "../types";

const SolveArtifical = () => {
    const { solutionData } = useContext(Context);
    const artData = useRef(new ArtificalData(solutionData.current));
    const simData = useRef(new SimplexData(solutionData.current));
    const [artTables, setArtTables] = useState(artData.current.history);
    const [artificlaError, setArtificalError] = useState(false);
    const [artOptimal, setArtOptimal] = useState(false);
    const [optClick, setOptClick] = useState(false);

    const ArtificalTables = () => {
        // массив таблиц реверсированный (как по мне так выглядит лучше, чем обычный)
        return [...artTables].reverse().map((table, i) => {
            return (
                <ArtificalTable
                    key={i}
                    data={artData.current}
                    table={table}
                    setTables={setArtTables}
                    setError={setArtificalError}
                    setOptimal={setArtOptimal}
                    optClick={optClick}
                />
            );
        });
    };

    useEffect(() => {
        if (solutionData.current.mode === AUTO_MODE) {
            artData.current.autoMode();
            setArtTables([...artData.current.history]);
            setArtificalError(artData.current.isUnsolvable());
            setArtOptimal(artData.current.isOptimal());
            if (artData.current.isOptimal()) {
                simData.current = new SimplexData(solutionData.current);
                simData.current.setReadySolution(artData.current.calcCoeffs(solutionData.current));
                simData.current.autoMode();
                setOptClick(true);
            }
        } else {
            setArtTables([...artData.current.history]);
            setArtificalError(artData.current.isUnsolvable());
            setArtOptimal(artData.current.isOptimal());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onNextClick = () => {
        const selected = artData.current.selected[artData.current.curCount];
        if (selected) {
            artData.current.nextStep(selected.var, selected.rest);
            setArtificalError(artData.current.isUnsolvable());
            setArtOptimal(artData.current.isOptimal());
            setArtTables([...artData.current.history]);
        }
    };

    const onPreviousClick = () => {
        artData.current.previousStep();
        setArtificalError(artData.current.isUnsolvable());
        setArtOptimal(artData.current.isOptimal());
        setArtTables([...artData.current.history]);
    };

    const onOptimalClick = () => {
        setOptClick(true);
        simData.current = new SimplexData(solutionData.current);
        simData.current.setReadySolution(artData.current.calcCoeffs(solutionData.current));
        console.log("OPTIMAL!!!!!");
        console.log(simData.current);
    };

    const ArtificalError = () => {
        if (artificlaError)
            return (
                <h6 className="text-center mb-3 text-danger">
                    Задача неразрешима. Существует Z<sub>i0</sub>, при котором все Z<sub>is</sub> из нового базиса равны
                    0
                </h6>
            );
        return null;
    };

    const YeahOptimal = () => {
        if (artOptimal) {
            return (
                <h6 className={`text-center mb-3 text-success ${optClick ? "d-none" : ""}`}>
                    Задача достигла оптимального решения
                </h6>
            );
        }
        return null;
    };

    const OptimalButton = () => {
        if (artOptimal) {
            return (
                // <Button className="btn-sm mb-2" variant="success" onClick={onOptimalClick} disabled={optClick}>
                <Button
                    className={`btn-sm mb-2 ${optClick ? "d-none" : ""}`}
                    variant="success"
                    onClick={onOptimalClick}
                >
                    Перейти к симплекс методу
                </Button>
            );
        }

        return null;
    };

    const Simplex = () => {
        if (optClick) return <SimplexMethod data={simData} backToArt={setOptClick} />;
        return null;
    };

    return (
        <>
            <Equations />
            <Simplex />
            <h4 className="text-center mb-3">Метод искусственного базиса</h4>
            <YeahOptimal />
            <ArtificalError />
            <div className="row d-flex">
                <div className="d-flex col-sm-12">
                    <Button
                        className={`btn-sm mb-2 ${optClick ? "d-none" : ""} mr-1`}
                        variant="primary"
                        onClick={onNextClick}
                    >
                        Следующий шаг
                    </Button>
                    <Button
                        className={`btn-sm mb-2 ${optClick ? "d-none" : ""} mr-1`}
                        variant="secondary"
                        onClick={onPreviousClick}
                    >
                        Предыдущий шаг
                    </Button>
                    <OptimalButton />
                </div>
                <div className="col-sm-12">
                    <ArtificalTables />
                </div>
            </div>
        </>
    );
};

export default SolveArtifical;