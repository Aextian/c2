import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { usePage } from "@inertiajs/react"
import { ITask } from "@/types/tasks-types"




export function Chart() {
    const{tasks} = usePage<{tasks:ITask[]}>().props

    const chartData = [
        {
            browser: "todo",
            visitors: tasks.filter((task) => task.status === "todo").length,
            fill: "var(--color-todo)",
        },
        {
            browser: "doing",
            visitors: tasks.filter((task) => task.status === "doing").length,
            fill: "var(--color-doing)",
        },
        {
            browser: "done",
            visitors: tasks.filter((task) => task.status === "done").length,
            fill: "var(--color-done)",
        },
        {
            browser: "cancelled",
            visitors: tasks.filter((task) => task.status === "cancelled").length,
            fill: "var(--color-cancelled)",
        },
      ]

      const chartConfig = {
        visitors: {
          label: "Tasks",
        },
        todo: {
          label: "Todo",
          color: "hsl(var(--chart-1))",
        },
        doing: {
          label: "Doing",
          color: "hsl(var(--chart-2))",
        },
        done: {
          label: "Done",
          color: "hsl(var(--chart-3))",
        },
        cancelled: {
          label: "Cancelled",
          color: "hsl(var(--chart-4))",
        },
      } satisfies ChartConfig


  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle> </CardTitle>
        <CardDescription>{new Date().toDateString()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" label nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
