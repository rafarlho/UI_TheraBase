import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Button } from "./ui/button"

function ThemeButton() {
    const { resolvedTheme, setTheme }  = useTheme()
    return (
        <Button variant={"ghost"} onClick={() => (setTheme(resolvedTheme === "light" ? "dark": "light"))}>{resolvedTheme === "light" ? <Moon className={resolvedTheme === "light" ? "text-primary" :""}/> : <Sun/>}</Button> 
    )
}

export default ThemeButton
