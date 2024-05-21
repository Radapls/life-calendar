import { ChangeEvent, MouseEvent, useState } from "react";
import { Week } from "../components/Week";
import { Loader } from "../ui-kit/Loader";
import html2canvas from "html2canvas";
import "./MainPage.styles.css";

export const MainPage = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [ageInWeeks, setAgeInWeeks] = useState(0);
    const [selectedWeeks, setSelectedWeeks] = useState<Array<boolean>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [lifeExpect, setLifeExpect] = useState<number>(80);
    const [screenShot, setScreenShot] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleImageDownload = () => {
        const imagePath = screenShot;
        const link = document.createElement("a");
        link.href = imagePath as string;
        link.download = "youLifeResume.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const yearWeeks = 52;

    const totalWeeksInLifeExpectancy = lifeExpect * yearWeeks;
    const percentageOfLifeExpectancy =
        (ageInWeeks * 1) / totalWeeksInLifeExpectancy;

    const calculateQuarter = percentageOfLifeExpectancy * 100;
    let quarter;

    switch (true) {
        case calculateQuarter > 0 && calculateQuarter <= 25:
            quarter = 1;
            break;
        case calculateQuarter <= 50 && calculateQuarter > 25:
            quarter = 2;
            break;
        case calculateQuarter <= 75 && calculateQuarter > 50:
            quarter = 3;
            break;
        case calculateQuarter > 75:
            quarter = 4;
            break;
        default:
            quarter = undefined;
    }

    const getQuarter = (quarter: number): string => {
        switch (quarter) {
            case 1:
                return "1st quarter";
            case 2:
                return "2nd quarter";
            case 3:
                return "3rd quarter";
            case 4:
                return "4th quarter";
            default:
                return "Unknown";
        }
    };

    const getActivities = (quarter: number): JSX.Element => {
        switch (quarter) {
            case 1:
                return (
                    <>
                        <li>Learning to walk and talk</li>
                        <li>Starting school and making friends</li>
                        <li>Going through puberty and adolescence</li>
                        <li>Graduating from high school</li>
                        <li>Attending college or starting a career</li>
                        <li>Experiencing first love and relationships</li>
                    </>
                );
            case 2:
                return (
                    <>
                        <li>Advancing in career or changing jobs</li>
                        <li>
                            Getting married or forming long-term partnerships
                        </li>
                        <li>Starting a family and raising children</li>
                        <li>
                            Buying a home or establishing financial stability
                        </li>
                        <li>Pursuing hobbies and personal interests</li>
                        <li>
                            Dealing with life's challenges and responsibilities
                        </li>
                    </>
                );
            case 3:
                return (
                    <>
                        <li>Experiencing children leaving home (empty nest)</li>
                        <li>
                            Advancing to senior roles in career or considering
                            retirement
                        </li>
                        <li>Traveling and exploring new hobbies</li>
                        <li>Becoming grandparents</li>
                        <li>Focusing on health and wellness</li>
                        <li>Engaging in community service or mentoring</li>
                    </>
                );
            case 4:
                return (
                    <>
                        <li>Enjoying retirement and leisure activities</li>
                        <li>
                            Maintaining health and managing medical conditions
                        </li>
                        <li>Spending time with family and friends</li>
                        <li>Reflecting on life and sharing wisdom</li>
                        <li>Pursuing lifelong passions and hobbies</li>
                        <li>
                            Making end-of-life preparations and legacy planning
                        </li>
                    </>
                );
            default:
                return <></>;
        }
    };

    const formatPercentage = (percentage: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "percent",
            minimumFractionDigits: 2,
        }).format(percentage);
    };

    const handleLifeExpectation = (e: ChangeEvent<HTMLInputElement>) => {
        const lifeExpectative = e.target.value;
        setLifeExpect(Number(lifeExpectative));
    };

    const handleDayOfBirth = (e: { target: { value: string } }) => {
        const dob = e.target.value;
        setSelectedDate(dob);
    };

    const handleIsChecked = (index: number) => {
        const updatedSelectedWeeks = [...selectedWeeks];
        updatedSelectedWeeks[index] = !updatedSelectedWeeks[index];
        setSelectedWeeks(updatedSelectedWeeks);
    };

    const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSelectedDate("");
        setAgeInWeeks(0);
        setLifeExpect(0);
        setSelectedWeeks([]);
        setIsModalOpen(false);
        setScreenShot("");

        const canvas = document.querySelector("canvas");
        if (canvas) {
            canvas.remove();
        }

        const lifeExpectInput = document.getElementById(
            "lifeExpect"
        ) as HTMLInputElement;
        const dobInput = document.getElementById("dob") as HTMLInputElement;
        lifeExpectInput.value = "";
        dobInput.value = "";
    };

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (selectedDate) {
            setIsLoading(true);
            const currentDate = new Date();
            const dob = new Date(selectedDate);
            const ageDiffMilliseconds = currentDate.getTime() - dob.getTime();
            const ageInWeeks = Math.floor(
                ageDiffMilliseconds / (1000 * 60 * 60 * 24 * 7)
            );
            const maxWeeks = lifeExpect * yearWeeks;
            const weeksToRender = Math.min(ageInWeeks, maxWeeks); // Limit to maximum weeks
            setAgeInWeeks(weeksToRender);

            // Initialize selectedWeeks with true for the first ageInWeeks weeks
            const initialSelectedWeeks = Array.from(
                { length: weeksToRender },
                () => true
            );
            setSelectedWeeks(initialSelectedWeeks);

            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    };

    const handleScreenshot = () => {
        html2canvas(document.querySelector("#capture") as HTMLElement, { scale: 1}).then(
            (canvas) => {
                // Append the canvas to the body
                document.body.appendChild(canvas);

                // Set the screenshot state
                setScreenShot(canvas.toDataURL());
            }
        );

        handleOpenModal();
    };

    return (
        <section>
            <h1 className="title">Life Calendar</h1>
            <p className="description">
                This project was created to have a visualization of or lifes,
                remarking the imporatance of or finite time. The date format is
                MM-DD-YYYY.
            </p>
            <form>
                Set your life expectation:
                <input
                    type="number"
                    name="lifeExpect"
                    id="lifeExpect"
                    min={0}
                    onChange={handleLifeExpectation}
                    disabled={ageInWeeks ? true : false}
                />
                Please enter your day of birth:
                <input
                    type="date"
                    name="dob"
                    id="dob"
                    onChange={handleDayOfBirth}
                    lang="es"
                    required
                    pattern="\d{4}-\d{2}-\d{2}"
                    disabled={ageInWeeks ? true : false}
                />
                {ageInWeeks === 0 ? (
                    <abbr title="Calculate how many weeks are you lived.">
                        <button className="btn" onClick={handleSubmit}>
                            <span className="back"></span>
                            <span className="front"></span>
                        </button>
                    </abbr>
                ) : (
                    !isLoading && (
                        <>
                            <button
                                type="reset"
                                onClick={handleReset}
                                className="delete-button"
                            >
                                <div>
                                    <span>Reset</span>
                                </div>
                            </button>
                        </>
                    )
                )}
            </form>

            {isLoading ? (
                <div className="loader-container">
                    <Loader />
                </div>
            ) : (
                ageInWeeks !== 0 && (
                    <>
                        {screenShot !== null && (
                            <div>
                                <button
                                    id="open-modal"
                                    type="button"
                                    onClick={handleScreenshot}
                                >
                                    Save your results
                                </button>
                                {isModalOpen && (
                                    <div className="modal-container">
                                        <dialog open>
                                            <img
                                                src={screenShot}
                                                alt="Screenshot"
                                                onClick={handleImageDownload}
                                                style={{ cursor: "pointer" }}
                                            />
                                            <button
                                                id="close"
                                                className="close"
                                                type="button"
                                                onClick={handleCloseModal}
                                            >
                                                &times;
                                            </button>
                                        </dialog>
                                        <div
                                            className="backdrop"
                                            onClick={handleCloseModal}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        )}

                        {screenShot === null && (
                            <button onClick={handleScreenshot}>
                                Create a resume
                            </button>
                        )}

                        <div className="content">
                            {[...Array(lifeExpect)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        borderBottom:
                                            i % 20 === 19
                                                ? "2px solid black"
                                                : "none",
                                        paddingBottom:
                                            i % 20 === 19 ? "5px" : "none",
                                    }}
                                >
                                    <div>
                                        <p>{i}</p>
                                    </div>
                                    <div>
                                        {[...Array(52)].map((_, j) => (
                                            <Week
                                                handleIsChecked={() =>
                                                    handleIsChecked(i * 52 + j)
                                                }
                                                key={j}
                                                isChecked={
                                                    selectedWeeks[i * 52 + j] ||
                                                    false
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <section className="print-card" id="capture">
                            <div>Some data for you:</div>

                            <ol>
                                <li>
                                    {`You have live ${ageInWeeks} weeks this is the ${formatPercentage(percentageOfLifeExpectancy)} of your total life expectation that is ${lifeExpect * yearWeeks}`}
                                </li>
                                {quarter && (
                                    <li>
                                        {`You are in the ${getQuarter(quarter)} of your life at this time people:`}
                                        <ul className="activities">
                                            {getActivities(quarter)}
                                        </ul>
                                    </li>
                                )}
                            </ol>

                            @cunctae
                        </section>
                    </>
                )
            )}
        </section>
    );
};
