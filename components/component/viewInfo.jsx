import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { ChevronDownIcon } from "lucide-react"

const ViewInfo = ({ data, onDelete }) => {
    return (
        <div className="transition flex flex-wrap gap-1">
            {data.map((property, index) => (
                <Collapsible key={index} className="flex flex-col bg-slate-800 p-2 space-x-2 rounded ">
                    <CollapsibleTrigger className="flex items-center justify-between">
                        <div className="font-medium">{Object.values(property)[0]}<span className="text-sm font-normal ml-1">{Object.values(property)[1]}</span></div>
                        <ChevronDownIcon className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="py-1 text-sm">
                            {Object.keys(property).map((key, index) => (
                                <div key={index} className="py-1 grid grid-cols-2">
                                    <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}: </span>
                                    {property[key]}
                                </div>
                            ))}
                        </div>
                        <button className="w-full transition bg-red-600 hover:bg-red-700 flex justify-center items-center rounded" onClick={() => onDelete(index)}>Delete</button>
                    </CollapsibleContent>
                </Collapsible>
            ))}
        </div>
    )
}

export default ViewInfo