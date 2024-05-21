export interface WeekProps {
    isChecked: boolean;
    handleIsChecked: () => void;
}

export const Week = ({ isChecked, handleIsChecked }: WeekProps) => {
    return (
        <input
            type="checkbox"
            name="week"
            onChange={handleIsChecked}
            checked={isChecked}
        />
    );
};
