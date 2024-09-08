// Layout de los Grupos de Inputs
import { ChevronDownIcon } from "lucide-react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../../ui/collapsible"

const InputGroup = ({ title, children }) => {
    return (
        <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="font-medium">{title}</div>
                <ChevronDownIcon className=" h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="space-y-4">
                        {children}
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}

export default InputGroup