import { Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { ListItem } from "../../types/shared";

export interface IndexedChipProps {
    index: number
    list: ListItem[]
    defaultName?: string
}

function IndexedChip(props: IndexedChipProps) {
    const [chipLabel, setChipLabel] = useState<string>("");

    useEffect(() => {
        const foundItem = props.list.find(item => item.id === props.index);
        if (!!foundItem) {
            setChipLabel(foundItem.name);
        }
    }, [props.list, props.index])

    return (
        <Chip key={props.index} label={chipLabel??props.defaultName??"---"} />
    )
}

export default IndexedChip;