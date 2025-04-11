import { FILTERS_BUTTONS} from "../../utils/typeScript/consts"
import { FilterValue } from "../../utils/typeScript/vite-env"

interface props {
    onFilterChange: (filter: FilterValue) => void,
    filterSelected: FilterValue,

}
export const Filters: React.FC<props> = ({filterSelected, onFilterChange}) => {
    const handleClick = (filter: FilterValue) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        onFilterChange(filter)
    }
    return(
        <ul className="filters">
            {
                Object.entries(FILTERS_BUTTONS).map(([key,{href, literal}]) => {
                    const isSelected = key === filterSelected;
                    const className = isSelected ? 'selected' : '';
                    return(
                        <li key={key} >
                            <a href={href} style={{ cursor: 'pointer' }} className={className} onClick={handleClick(key as FilterValue)}>
                                {literal}
                            </a>
                        </li>
                    )
                })
            }
        </ul>
    )
}