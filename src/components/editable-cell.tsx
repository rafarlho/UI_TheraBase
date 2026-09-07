import { useState } from "react"
import { Input } from "./ui/input"
import { cn } from "#/lib/utils"

function EditableCell({
    value: initialValue, 
    onSave
}: { 
    value:string, 
    onSave:(newValue:string) => Promise<any>}) 
{
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(initialValue)
    const [isSaving, setIsSaving] = useState(false)

    async function handleSave() {
        setIsEditing(false)
        if(value === initialValue) return
        setIsSaving(true)
        await onSave(value)
        setIsSaving(false)
    }

    if(isEditing) {
        return (
            <Input autoFocus value={value} 
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                    if(e.key === "Enter") e.currentTarget.blur()
                    if(e.key === "Escape") {
                        setValue(initialValue)
                        setIsEditing(false)
                    }
                }}
                className="h-8"
            />
        )
    }

    return <div
        onClick={()=> setIsEditing(true)}
        className={cn("cursor-pointer rounded px-2 py-1 hover:bg-muted", isSaving && "opacity-50")}
    >
        {value}
    </div>
    
}

export default EditableCell
