import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTable } from './DataTable';
import emailjs from '@emailjs/browser';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import {
  Activity,
  Bell,
  Calendar as CalendarIcon,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import DefaultProfile from '@/assets/default.jpg';
import moment from 'moment';
import { ExportToPDF } from '@/components/ExportPdf';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import PaginationTemplate from '@/components/Pagination';
import usePagination from '@/hooks/usePagination';
import { StatusUpdateDialog } from '@/components/UpdateStatus';

// const patients = [
//   {
//     id: 1,
//     name: 'Alice Johnson',
//     age: 35,
//     lastVisit: '2023-06-15',
//     nextAppointment: '2023-07-01',
//     status: 'Stable',
//   },
//   {
//     id: 2,
//     name: 'Bob Smith',
//     age: 52,
//     lastVisit: '2023-06-10',
//     nextAppointment: '2023-06-25',
//     status: 'Follow-up Required',
//   },
//   {
//     id: 3,
//     name: 'Carol Williams',
//     age: 28,
//     lastVisit: '2023-06-18',
//     nextAppointment: '2023-07-05',
//     status: 'New Patient',
//   },
//   // Add more mock patient data as needed
// ];

interface PatientsType {
  patient_id: string;
  fullname: string;
  age: number;
  last_visit: string;
  next_appointment: string;
  status: string;
}

interface FormDataType {
  fullname: string;
  age: string;
  phone: string;
}

interface FormDataTypeAppointments {
  fullname?: string;
  title: string;
  appointment_date: string;
}

interface MedicineData {
  medicine_id: string;
  medicine_name: string;
  time: string;
  size: string;
  status: string;
  patient_id: string;
}

const useCreatePatients = () => {
  return useMutation({
    mutationFn: async (data: {
      formData: FormDataType;
      status: string;
      username: string;
      password: string;
    }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/patients/create`,
        {
          ...data.formData,
          status: data.status,
          username: data.username,
          password: data.password,
        },
      );
      return response.data;
    },

    onSuccess: (data) => {
      if (data.status === 'success') {
        console.log('patient added successfully', data);
        toast({
          title: 'patient added successfully',
          description: new Date().toLocaleTimeString(),
        });
      }
    },
    onError: (error) => {
      console.error('Error:', error);
      toast({
        title: 'Error adding patient',
        description: error.message || 'Something went wrong.',
      });
    },
  });
};

const useFetchPatient = () => {
  return useQuery<PatientsType[]>({
    queryKey: ['patientsData'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/patients`,
      );
      console.log('response', response.data);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

const useFetchPatientAppointment = () => {
  return useQuery<FormDataTypeAppointments[]>({
    queryKey: ['patientAppointments'],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/appointments`,
      );

      console.log(response.data);
      return response.data;
    },
  });
};

const useCreateAppointments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      formData: FormDataTypeAppointments;
      patient_id: string;
    }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_LINK}/appointments/create`,
        {
          ...data.formData,
          patient_id: data.patient_id,
        },
      );
      return response.data;
    },

    onSuccess: (data) => {
      if (data.status === 'success') {
        console.log('Appointments added successfully', data);
        toast({
          title: 'Appointments added successfully',
          description: new Date().toLocaleTimeString(),
        });
      }
      queryClient.invalidateQueries({ queryKey: ['patientsData'] });
    },
    onError: (error) => {
      console.error('Error:', error);
      toast({
        title: 'Error adding Appointments',
        description: error.message || 'Something went wrong.',
      });
    },
  });
};

const useFetchMedicine = (id: string) => {
  return useQuery<MedicineData[]>({
    queryKey: ['medicineData', id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/medicine/${id}`,
      );

      console.log(response.data);
      return response.data;
    },
  });
};

const columns: ColumnDef<PatientsType>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`https://avatar.vercel.sh/${row.original.patient_id}.png`}
              alt={row.original.fullname}
            />
            <AvatarFallback>
              {row.original.fullname
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <span className="ml-2">{row.original.fullname}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'age',
    header: 'Age',
    cell: ({ row }) => {
      return row.original.age || 'N/A';
    },
  },
  {
    accessorKey: 'last_visit',
    header: 'Last Visit',
    cell: ({ row }) => {
      const lastVisit = row.original.last_visit;
      const formattedDate = moment(lastVisit);

      return formattedDate.isValid() ? formattedDate.format('ll') : 'N/A';
    },
  },
  {
    accessorKey: 'next_appointment',
    header: 'Next Appointment',
    cell: ({ row }) => {
      const nextAppointment = row.original.next_appointment;
      const formattedDate = moment(nextAppointment);

      return formattedDate.isValid() ? formattedDate.format('ll') : 'N/A';
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const [formData, setFormData] = useState({
        title: '',
        appointment_date: '',
      });
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [isDialogOpenViewDetails, setIsDialogOpenViewDetails] =
        useState(false);
      const patient_id = row.original.patient_id;
      const { data: patientMedicine = [] } = useFetchMedicine(patient_id);

      const createMutation = useCreateAppointments();
      const queryClient = useQueryClient();

      const handleStatusUpdate = async () => {
        console.log('Status updated to Done');

        try {
          const response = await axios.put(
            `${import.meta.env.VITE_API_LINK}/patients/update/status/${row.original.patient_id}`,
            {
              status: 'Done',
            },
          );

          if (response.data?.status === 'success') {
            toast({
              title: 'Status updated successfully',
              description: new Date().toLocaleTimeString(),
            });

            queryClient.invalidateQueries({ queryKey: ['patientsData'] });
          } else {
            toast({
              title: 'Update Failed',
              description: response.data?.message || 'Unknown error occurred.',
            });
          }
        } catch (error) {
          console.error('Error:', error);
          toast({
            title: 'Error updating status',
            description: 'Something went wrong.',
          });
        }
      };

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };

      const handleSubmitAppointment = async (
        e: React.FormEvent<HTMLFormElement>,
      ) => {
        e.preventDefault();

        console.log(
          'Form data',
          formData,
          'Patient ID',
          row.original.patient_id,
        );

        createMutation.mutate({
          formData,
          patient_id: row.original.patient_id,
        });

        setFormData({
          title: '',
          appointment_date: '',
        });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(
                  row.original.patient_id.toString(),
                )
              }
            >
              Copy patient ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setIsDialogOpenViewDetails(true);
              }}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <StatusUpdateDialog onStatusUpdate={handleStatusUpdate} />
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setIsDialogOpen(true);
              }}
            >
              Set Appointments
            </DropdownMenuItem>
          </DropdownMenuContent>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="w-[40rem]">
              <DialogHeader>
                <DialogTitle>Set Patients Appointments</DialogTitle>
                <DialogDescription>
                  Set the next appointment for the patient
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitAppointment}>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  onChange={handleInputChange}
                  value={formData.title}
                  type="text"
                  className="w-full rounded-md border p-2"
                  required
                />

                <Label htmlFor="date">Appointment Date</Label>
                <Input
                  id="date"
                  name="appointment_date"
                  onChange={handleInputChange}
                  value={formData.appointment_date}
                  type="datetime-local"
                  className="w-full rounded-md border p-2"
                  required
                />

                <Button type="submit" className="mt-4">
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isDialogOpenViewDetails}
            onOpenChange={setIsDialogOpenViewDetails}
          >
            <DialogContent className="w-[60rem]">
              <DialogHeader>
                <DialogTitle>View Details</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>

              <div className="flex gap-4">
                <Card className="w-full max-w-md p-6 shadow-sm">
                  <CardContent className="p-0 space-y-4">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight">
                        {row.original.fullname}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Age: {row.original.age}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          Last Visit
                        </span>
                        <span className="text-sm">
                          {moment(row.original.last_visit).isValid()
                            ? moment(row.original.last_visit).format('ll')
                            : 'N/A'}
                        </span>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          Next Appointment
                        </span>
                        <span className="text-sm">
                          {moment(row.original.next_appointment).isValid()
                            ? moment(row.original.next_appointment).format('ll')
                            : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Status
                      </span>
                      <Badge variant="secondary" className="font-medium">
                        {row.original.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-full max-w-md shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-2xl font-semibold tracking-tight">
                      Medication Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[300px] px-6">
                      {patientMedicine.length === 0 ? (
                        <div className="py-4 text-center text-sm text-muted-foreground">
                          No added medication
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-sm font-medium text-muted-foreground">
                                Medication
                              </TableHead>
                              <TableHead className="text-sm font-medium text-muted-foreground">
                                Time & Dosage
                              </TableHead>
                              <TableHead className="text-sm font-medium text-muted-foreground">
                                Status
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {patientMedicine.map((med, index) => (
                              <TableRow key={index}>
                                <TableCell className="py-3 text-sm font-medium">
                                  {med.medicine_name}
                                </TableCell>
                                <TableCell className="py-3 text-sm text-muted-foreground">
                                  {moment(med.time, 'HH:mm').format('h:mm A')} -{' '}
                                  {med.size}
                                </TableCell>
                                <TableCell className="py-3">
                                  <Badge
                                    variant={
                                      med.status === 'Taken'
                                        ? 'default'
                                        : 'secondary'
                                    }
                                    className="font-medium"
                                  >
                                    {med.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        </DropdownMenu>
      );
    },
  },
];

// Mock data for health trends
const healthTrends = [
  { name: 'Jan', avgBP: 120, avgWeight: 70 },
  { name: 'Feb', avgBP: 118, avgWeight: 69 },
  { name: 'Mar', avgBP: 122, avgWeight: 71 },
  { name: 'Apr', avgBP: 119, avgWeight: 70 },
  { name: 'May', avgBP: 121, avgWeight: 72 },
  { name: 'Jun', avgBP: 120, avgWeight: 71 },
];

export default function StaffDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    fullname: '',
    age: '',
    phone: '',
    email: '',
  });

  const createMutationPatient = useCreatePatients();
  const { data: patients } = useFetchPatient();
  const { data: appointments } = useFetchPatientAppointment();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const generatePasswordRandom = () => {
    const length = 8;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    const generatedPassword = retVal;
    const generatedUsername =
      formData.fullname.split(' ').join('') + retVal.slice(0, 3);

    return { generatedPassword, generatedUsername };
  };

  const handleSubmitAddPatient = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    const { generatedPassword, generatedUsername } = generatePasswordRandom();

    try {
      const SERVICE_ID = 'service_d6xu2co';
      const TEMPLATE_ID = 'template_yckybkd';
      const PUBLIC_KEY = 'FeDjyzRYzhIc6nVNC';

      console.log(formData.email);

      const formDataEMail = {
        to_email: formData.email,
        to_name: formData.fullname,
        from_name: 'MEDITRACK',
        subject: 'YOUR MEDITRACK ACCOUNT',
        message: `Hello, Your Username:${generatedUsername}, Your Password:${generatedPassword}`,
      };

      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        formDataEMail,
        PUBLIC_KEY,
      );

      console.log(result.text);

      console.log({
        formData,
        status: 'New Patient',
        username: generatedUsername,
        password: generatedPassword,
      });

      createMutationPatient.mutate({
        formData,
        status: 'New Patient',
        username: generatedUsername,
        password: generatedPassword,
      });

      setFormData({
        fullname: '',
        age: '',
        phone: '',
        email: '',
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogout = () => {
    window.location.href = '/login';
    localStorage.removeItem('patient_id');
    localStorage.removeItem('health_monitoring_role');
  };

  const todayAppointments =
    appointments?.filter((appointment) =>
      moment(appointment.appointment_date).isSame(moment(), 'day'),
    ) || [];

  const filteredPatients =
    patients?.filter((pat) =>
      pat.fullname.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const { currentItems, totalPages, currentPage, handlePageChange } =
    usePagination({
      itemsPerPage: 6,
      data: filteredPatients,
    });

  const {
    currentItems: currentItemsAppointments,
    totalPages: totalPagesAppointments,
    currentPage: currentPageAppointments,
    handlePageChange: handlePageChangeAppointments,
  } = usePagination({
    itemsPerPage: 6,
    data: appointments || [],
  });

  return (
    <TooltipProvider>
      <div className="container mx-auto space-y-8 p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-h-[400px] overflow-y-auto p-3 bg-white rounded-lg shadow-lg w-[300px]">
                <div className="space-y-3">
                  {todayAppointments.length === 0 ? (
                    <div className="text-center text-gray-500">
                      No appointments for today.
                    </div>
                  ) : (
                    todayAppointments.map((appointment, index) => (
                      <div
                        key={index}
                        className="p-3 border-b border-gray-200 hover:bg-gray-50"
                      >
                        <strong className="text-sm font-bold text-gray-700">
                          Today, {appointment.fullname} has an appointment!
                        </strong>
                        <p className="text-xs text-gray-500">
                          {appointment.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {moment(appointment.appointment_date).format(
                            'hh:mm A',
                          )}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger>
                {' '}
                <Avatar className="cursor-pointer object-cover">
                  <AvatarImage src={DefaultProfile} alt="staff" />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Patients
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patients?.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Total number of patients in the system
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Total number of patients in the system</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Appointments Today
                  </CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {todayAppointments.length > 0 ? (
                      todayAppointments.length
                    ) : (
                      <div>0</div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total number of appointments scheduled for today
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Number of scheduled appointments for today</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Visit Duration
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">32m</div>
                  <p className="text-xs text-muted-foreground">
                    -2m from last week
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Average duration of patient visits</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Number of New Patient
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {
                      patients?.filter(
                        (patient) => patient.status === 'New Patient',
                      ).length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total number of new patients in the system
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Overall patient satisfaction rate</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patient List</CardTitle>
                <CardDescription>
                  Manage and view patient information
                </CardDescription>
              </div>

              <div className="flex gap-4">
                <Dialog>
                  <DialogTrigger>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Patient
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Patient</DialogTitle>
                      <DialogDescription>
                        Enter the details of the new patient here. Click save
                        when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <form
                        onSubmit={handleSubmitAddPatient}
                        className="flex flex-col gap-2"
                      >
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            required
                            name="fullname"
                            onChange={handleInputChange}
                            value={formData.fullname}
                            id="fullname"
                            className="col-span-3"
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input
                            required
                            name="email"
                            type="email"
                            onChange={handleInputChange}
                            value={formData.email}
                            id="email"
                            className="col-span-3"
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="age" className="text-right">
                            Age
                          </Label>
                          <Input
                            required
                            id="age"
                            name="age"
                            onChange={handleInputChange}
                            value={formData.age}
                            className="col-span-3"
                          />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="phone" className="text-right">
                            Phone
                          </Label>
                          <Input
                            required
                            id="phone"
                            name="phone"
                            onChange={handleInputChange}
                            value={formData.phone}
                            className="col-span-3"
                          />
                        </div>
                        <Button className="self-end" type="submit">
                          Save Patient
                        </Button>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>

                <ExportToPDF
                  data={(patients ?? []).map((patient) => ({
                    patient_id: patient.patient_id || 'N/A',
                    fullname: patient.fullname || 'No data',
                    age: patient.age || 0,
                    status: patient.status || 'Unknown',
                    last_visit: patient.last_visit || 'N/A',
                    next_appointment: patient.next_appointment || 'N/A',
                  }))}
                  fileName="patients"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patients..."
                className="w-[20rem]"
              />
            </div>

            <DataTable columns={columns} data={currentItems} />

            <PaginationTemplate
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Health Trends</CardTitle>
              <CardDescription>
                Average blood pressure and weight over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="avgBP"
                    stroke="#8884d8"
                    name="Avg. Blood Pressure"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avgWeight"
                    stroke="#82ca9d"
                    name="Avg. Weight"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="w-full  shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px] px-6">
                {(appointments?.length ?? 0) === 0 ? (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    No scheduled appointments
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-sm font-medium text-muted-foreground">
                          Patient
                        </TableHead>
                        <TableHead className="text-sm font-medium text-muted-foreground">
                          Title
                        </TableHead>
                        <TableHead className="text-sm font-medium text-muted-foreground">
                          Date & Time
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments &&
                        currentItemsAppointments.map((appointment, index) => (
                          <TableRow key={index}>
                            <TableCell className="py-3 text-sm font-medium">
                              {appointment.fullname}
                            </TableCell>
                            <TableCell className="py-3 text-sm text-muted-foreground">
                              {appointment.title}
                            </TableCell>
                            <TableCell className="py-3 text-sm text-muted-foreground">
                              {moment(appointment.appointment_date).format(
                                'MMM D, YYYY - h:mm A',
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </ScrollArea>
            </CardContent>

            <PaginationTemplate
              totalPages={totalPagesAppointments}
              currentPage={currentPageAppointments}
              handlePageChange={handlePageChangeAppointments}
            />
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
